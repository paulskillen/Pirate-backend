import {
    CACHE_MANAGER,
    forwardRef,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
// import {
//     ESimGoApiHeader,
//     ESIM_GO_CACHE_KEY,
//     ESIM_GO_CACHE_TTL,
// } from './eSimGo.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import { AxiosError } from 'axios';
import { ESimGoService } from '../provider/eSim-go/eSimGo.service';

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

    // ****************************** QUERY DATA ********************************//

    async findAll(): Promise<any> {
        return true;
    }

    async findAllFromCountry(countryCode: string): Promise<any> {
        const esimBundles = await this.eSimGoService.getListBundleFromCountry(
            countryCode,
        );
        return esimBundles;
    }
    // ****************************** MUTATE DATA ********************************//
}
