import { Module } from '@nestjs/common';
import { AdminAuthenticatorModule } from './admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from './admin-role/admin-role.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminOrderModule } from './admin-order/admin-order.module';
import { AdminCustomerModule } from './admin-customer/admin-customer.module';
import { AdminMediaModule } from './admin-media/admin-media.module';

@Module({
    imports: [
        AdminUserModule,
        AdminRoleModule,
        AdminAuthModule,
        AdminOrderModule,
        AdminCustomerModule,
        AdminAuthenticatorModule,
        AdminMediaModule,
    ],
})
export class AdminModules {}
