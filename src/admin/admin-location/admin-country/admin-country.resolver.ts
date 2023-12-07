import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { CountryService } from 'src/modules/country/country.service';

@Resolver()
export class AdminCountryResolver {
    constructor(
        private countryService: CountryService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => JSON)
    async listCountryForAdmin(): Promise<any> {
        return await this.countryService.findAll();
    }
}
