import { Module } from '@nestjs/common';
import { ProviderBundleModule } from 'src/modules/provider-bundle/provider-bundle.module';
import { AdminAuthenticatorModule } from '../admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminBundleResolver } from './admin-bundle.resolver';

@Module({
    imports: [ProviderBundleModule, AdminRoleModule, AdminAuthenticatorModule],
    providers: [AdminBundleResolver],
    exports: [AdminBundleResolver, ProviderBundleModule],
})
export class AdminBundleModule {}
