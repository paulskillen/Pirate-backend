import { forwardRef, Module } from '@nestjs/common';
import { CustomerBundleResolver } from './customer-bundle.resolver';
import { ProviderBundleModule } from 'src/modules/provider-bundle/provider-bundle.module';

@Module({
    imports: [ProviderBundleModule],
    providers: [CustomerBundleResolver],
    exports: [CustomerBundleResolver],
})
export class CustomerBundleModule {}
