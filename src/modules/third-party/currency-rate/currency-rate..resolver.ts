import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { CurrencyRateService } from './currency-rate.service';

@Resolver()
export class CurrencyRateResolver {
    constructor(
        // @Inject(forwardRef(() => ESimGoService))
        private currencyRateService: CurrencyRateService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => JSON)
    async getCurrencyRates(): Promise<any> {
        return await this.currencyRateService.getCurrencyRate();
    }
}
