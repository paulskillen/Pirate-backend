import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Cache } from 'cache-manager';
import { find, forEach, map, pick } from 'lodash';
import { ESimGoService } from '../provider/eSim-go/eSimGo.service';
import { ESimGoBundle } from '../provider/eSim-go/schema/bundle/eSimGo-bundle.schema';
import { ProviderName } from '../provider/provider.constant';
import {
    ProviderBundleDto,
    ProviderBundlePaginateResponse,
} from './dto/provider-bundle.dto';
import {
    BundleConfigInput,
    ProviderBundlePaginateInput,
} from './dto/provider-bundle.input';
import {
    ProviderBundle,
    ProviderBundleDocument,
} from './schema/provider-bundle.schema';
import { ErrorNotFound } from 'src/common/errors/errors.constant';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import { BUNDLE_CACHE_KEY, BUNDLE_CACHE_TTL } from './provider-bundle.constant';

@Injectable()
export class ProviderBundleService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

        @InjectModel(ProviderBundle.name)
        private bundleModel: PaginateModel<ProviderBundleDocument>,

        @InjectModel(ProviderBundle.name)
        private bundleSoftDeleteModel: SoftDeleteModel<ProviderBundleDocument>,

        private eventEmitter: EventEmitter2,
        private eSimGoService: ESimGoService,
    ) {}

    private readonly logger = new Logger(ProviderBundleService.name);

    bundleCache = new AppCacheServiceManager(
        this.cacheManager,
        BUNDLE_CACHE_KEY,
        BUNDLE_CACHE_TTL,
    );

    providers = [
        {
            id: ProviderName.ESIM_GO,
            service: this.eSimGoService,
            mapFunc: this.mapEsimGoBundleToProviderBundle,
        },
    ];

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    private mapEsimGoBundleToProviderBundle(
        bundle: ESimGoBundle,
    ): ProviderBundleDto {
        const { dataAmount, price, name, duration, description } = bundle || {};
        return {
            id: name,
            refId: name,
            name,
            provider: ProviderName.ESIM_GO,
            bundleData: bundle as any,
            dataAmount,
            duration,
            description,
            price,
        };
    }

    // ****************************** QUERY DATA ********************************//

    async findById(id: string): Promise<ProviderBundle> {
        return this.bundleModel.findById(id);
    }

    async findByRefId(refId: string): Promise<ProviderBundle> {
        const cache = await this.bundleCache.get(refId);
        if (cache) {
            return typeof cache === 'string' ? JSON.parse(cache) : cache;
        }
        return await this.bundleModel.findOne({ refId });
    }

    async findAll(
        paginate: ProviderBundlePaginateInput,
    ): Promise<ProviderBundlePaginateResponse> {
        const res = await this.eSimGoService.findAll(paginate);
        return {
            ...(res || {}),
            data: map(
                res?.data ?? [],
                async (item) =>
                    await this.mapEsimGoBundleToProviderBundle(item),
            ),
        };
    }

    async findAllFromCountry(countryCode: string): Promise<any> {
        const mappedData: ProviderBundleDto[] = [];
        const esimBundles = await this.eSimGoService.getListBundleFromCountry(
            countryCode,
        );
        if (esimBundles?.length > 0) {
            forEach(esimBundles, (bundle) => {
                const mapped = this.mapEsimGoBundleToProviderBundle(bundle);
                mappedData.push(mapped);
            });
        }
        return { data: mappedData };
    }

    async getBundleFromProvider(
        bundle: string,
        provider: ProviderName,
    ): Promise<ProviderBundleDto> {
        try {
            const foundProvider = find(
                this.providers,
                (i) => i?.id === provider,
            );
            if (foundProvider?.service) {
                const foundBundle =
                    await foundProvider?.service?.findBundleById(bundle);
                if (foundProvider?.mapFunc) {
                    return foundProvider?.mapFunc(foundBundle);
                }
                return foundBundle as any;
            }
        } catch (error) {
            console.error({ error });
        }
    }

    // ****************************** MUTATE DATA ********************************//

    async updateBundleConfig(
        refId: string,
        payload: BundleConfigInput,
    ): Promise<ProviderBundle> {
        let providerName: ProviderName | null = null;
        const fromProvider = await this.eSimGoService.findBundleById(refId);
        if (!fromProvider) {
            throw ErrorNotFound();
        } else {
            providerName = ProviderName.ESIM_GO;
        }
        const updatePayload: Partial<ProviderBundle> = {
            ...(pick(fromProvider, [
                'name',
                'description',
                'dataAmount',
                'duration',
                'price',
            ]) || {}),
            bundleData: fromProvider,
            config: payload,
            provider: providerName,
        };
        const updated = await this.bundleModel.findOneAndUpdate(
            { refId },
            updatePayload,
            { upsert: true, new: true },
        );
        if (updated) {
            await this.bundleCache.set(updated, { key: refId });
        }
        return updated;
    }
}
