import {
    CACHE_MANAGER,
    forwardRef,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import * as countryData from './json/country-full.json';
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

@Injectable()
export class CountryService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
    ) {}

    private readonly logger = new Logger(CountryService.name);

    // eSimGoCache = new AppCacheServiceManager(
    //     this.cacheManager,
    //     ESIM_GO_CACHE_KEY,
    //     ESIM_GO_CACHE_TTL,
    // );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    // ****************************** ESIM ********************************//

    async findAll(): Promise<any> {
        return countryData;
    }
    // ****************************** MUTATE DATA ********************************//
}
