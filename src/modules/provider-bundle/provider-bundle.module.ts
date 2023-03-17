import { Module } from '@nestjs/common';
import { ProviderModule } from '../provider/provider.module';
import { ProviderBundleService } from './provider-bundle.service';

@Module({
    imports: [ProviderModule],
    providers: [ProviderBundleService],
    exports: [ProviderBundleService],
})
export class ProviderBundleModule {}
