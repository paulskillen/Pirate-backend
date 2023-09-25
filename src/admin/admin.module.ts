import { Module } from '@nestjs/common';
import { AdminAuthenticatorModule } from './admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from './admin-role/admin-role.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminCustomerModule } from './admin-customer/admin-customer.module';

@Module({
    imports: [
        AdminUserModule,
        AdminRoleModule,
        AdminAuthenticatorModule,
        AdminAuthModule,
        AdminCustomerModule,
    ],
})
export class AdminModule {}
