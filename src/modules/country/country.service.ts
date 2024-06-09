import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import * as countryData from './json/country-full.json';
import { filter, map } from 'lodash';
import { ESIM_GO_SUPPORTED_COUNTRIES_CACHE_KEY } from '../provider/eSim-go/eSimGo.constant';
import { ESimGoBundleCountry } from '../provider/eSim-go/schema/bundle/eSimGo-bundle.schema';
import { COUNTRY_CACHE_KEY, COUNTRY_CACHE_TTL } from './country.constant';

@Injectable()
export class CountryService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
    ) {}

    private readonly logger = new Logger(CountryService.name);

    countryCache = new AppCacheServiceManager(
        this.cacheManager,
        COUNTRY_CACHE_KEY,
        COUNTRY_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    // ****************************** ESIM ********************************//

    async findAll(): Promise<any> {
        const supportedCountries = await this.countryCache.get(
            ESIM_GO_SUPPORTED_COUNTRIES_CACHE_KEY,
        );
        if (supportedCountries) {
            const parsedData: Array<ESimGoBundleCountry> =
                JSON.parse(supportedCountries);
            if (parsedData && parsedData?.length > 0) {
                const supportedIso = map(parsedData, (item) => item?.iso);
                const filteredCountries = filter(countryData, (item) =>
                    supportedIso.includes(item?.iso),
                );
                return filteredCountries;
            }
        }
        return countryData;
    }
    // ****************************** MUTATE DATA ********************************//
}
