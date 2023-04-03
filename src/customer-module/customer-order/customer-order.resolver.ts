import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { ProviderBundlePaginateResponse } from 'src/modules/provider-bundle/dto/provider-bundle.dto';
import { ProviderBundleService } from 'src/modules/provider-bundle/provider-bundle.service';

@Resolver()
export class CustomerOrderResolver {
    constructor(
        private providerBundleService: ProviderBundleService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => ProviderBundlePaginateResponse)
    async listBundleFromCountryForCustomer(
        @Args('country') country: string,
    ): Promise<any> {
        return await this.providerBundleService.findAllFromCountry(country);
    }
}
