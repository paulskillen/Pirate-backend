import { Module } from '@nestjs/common';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminStaticResolver } from './admin-static.resolver';
import { StaticModule } from 'src/modules/static/static.module';
import { AdminAuthenticatorModule } from '../admin-authenticator/admin-authenticator.module';

@Module({
    imports: [AdminRoleModule, AdminAuthenticatorModule, StaticModule],
    providers: [AdminStaticResolver],
    exports: [StaticModule],
})
export class AdminStaticModule {}
