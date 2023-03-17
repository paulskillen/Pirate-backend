import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { CountryService } from 'src/modules/country/country.service';
import { ESimGoService } from 'src/modules/provider/eSim-go/eSimGo.service';

@Resolver()
export class CustomerCountryResolver {
    constructor(
        private countryService: CountryService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => JSON)
    async listCountryForCustomer(): Promise<any> {
        return await this.countryService.findAll();
    }
}
