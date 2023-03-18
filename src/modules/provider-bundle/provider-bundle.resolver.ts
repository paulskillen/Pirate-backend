import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { ProviderBundleDto } from './dto/provider-bundle.dto';
import { ProviderBundleService } from './provider-bundle.service';

@Resolver(() => ProviderBundleDto)
export class ProviderBundleDtoResolver {
    constructor(
        private readonly providerBundleService: ProviderBundleService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//
}
