import { Module } from '@nestjs/common';
import { ProviderModule } from '../provider/provider.module';
import { ProviderBundleDtoResolver } from './provider-bundle.resolver';
import { ProviderBundleService } from './provider-bundle.service';

@Module({
    imports: [ProviderModule],
    providers: [ProviderBundleService, ProviderBundleDtoResolver],
    exports: [ProviderBundleService, ProviderBundleDtoResolver],
})
export class ProviderBundleModule {}
