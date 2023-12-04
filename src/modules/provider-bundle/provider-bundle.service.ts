import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { find, forEach, map } from 'lodash';
import { ESimGoService } from '../provider/eSim-go/eSimGo.service';
import { ESimGoBundle } from '../provider/eSim-go/schema/bundle/eSimGo-bundle.schema';
import { ProviderName } from '../provider/provider.constant';
import {
    ProviderBundleDto,
    ProviderBundlePaginateResponse,
} from './dto/provider-bundle.dto';
import { ProviderBundlePaginateInput } from './dto/provider-bundle.input';

@Injectable()
export class ProviderBundleService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
        private eSimGoService: ESimGoService,
    ) {}

    private readonly logger = new Logger(ProviderBundleService.name);

    // eSimGoCache = new AppCacheServiceManager(
    //     this.cacheManager,
    //     ESIM_GO_CACHE_KEY,
    //     ESIM_GO_CACHE_TTL,
    // );

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
}
