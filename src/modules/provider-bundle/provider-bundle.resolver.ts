import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';
import { BundleConfigDto, ProviderBundleDto } from './dto/provider-bundle.dto';
import { ProviderBundleService } from './provider-bundle.service';
import { ProviderBundle } from './schema/provider-bundle.schema';
import JSON from 'graphql-type-json';
import { priceSaleFormula } from 'src/common/constant/app.constant';

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
        const { price, dataAmount } = parent;
        if (!price) {
            return null;
        }
        return priceSaleFormula(price, dataAmount);
    }

    @ResolveField(() => BundleConfigDto)
    async config(
        @Parent() parent: ProviderBundle,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { provider, name } = parent;
        if (!name) {
            return null;
        }
        const res = await this.providerBundleService.findByRefId(name);
        return res?.config;
    }
}
