import { Module } from '@nestjs/common';
import { AdminAuthenticatorModule } from './admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from './admin-role/admin-role.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
    imports: [AdminUserModule, AdminRoleModule, AdminAuthenticatorModule],
})
export class AdminModule {}
