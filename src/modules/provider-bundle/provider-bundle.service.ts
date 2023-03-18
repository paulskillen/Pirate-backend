import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { forEach } from 'lodash';
import { ESimGoService } from '../provider/eSim-go/eSimGo.service';
import { ESimGoBundle } from '../provider/eSim-go/schema/bundle/eSimGo-bundle.schema';
import { ProviderName } from '../provider/provider.constant';
import { ProviderBundleDto } from './dto/provider-bundle.dto';

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

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    private mapEsimBundleToProviderBundle(
        bundle: ESimGoBundle,
    ): ProviderBundleDto {
        const { dataAmount, price, name, duration, description } = bundle || {};
        return {
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

    async findAll(): Promise<any> {
        return true;
    }

    async findAllFromCountry(countryCode: string): Promise<any> {
        const mappedData: ProviderBundleDto[] = [];
        const esimBundles = await this.eSimGoService.getListBundleFromCountry(
            countryCode,
        );
        if (esimBundles?.length > 0) {
            forEach(esimBundles, (bundle) => {
                const mapped = this.mapEsimBundleToProviderBundle(bundle);
                mappedData.push(mapped);
            });
        }
        return { data: mappedData };
    }
    // ****************************** MUTATE DATA ********************************//
}
