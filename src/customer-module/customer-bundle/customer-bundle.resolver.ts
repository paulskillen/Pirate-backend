import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { ProviderBundleService } from 'src/modules/provider-bundle/provider-bundle.service';

@Resolver()
export class CustomerBundleResolver {
    constructor(
        private providerBundleService: ProviderBundleService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => JSON)
    async listBundleFromCountryForCustomer(
        @Args('country') country: string,
    ): Promise<any> {
        return await this.providerBundleService.findAllFromCountry(country);
    }
}
