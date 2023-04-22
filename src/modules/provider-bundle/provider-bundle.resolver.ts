import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';
import { ProviderBundleDto } from './dto/provider-bundle.dto';
import { ProviderBundleService } from './provider-bundle.service';
import { ProviderBundle } from './schema/provider-bundle.schema';
import JSON from 'graphql-type-json';

@Resolver(() => ProviderBundleDto)
export class ProviderBundleDtoResolver {
    constructor(
        private readonly providerBundleService: ProviderBundleService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @ResolveField(() => JSON)
    async salePrice(
        @Parent() parent: ProviderBundle,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<string> {
        const { price } = parent;
        if (!price) {
            return null;
        }
        return price;
    }
}
