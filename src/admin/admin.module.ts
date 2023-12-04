import { Module } from '@nestjs/common';
import { AdminAuthenticatorModule } from './admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from './admin-role/admin-role.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminOrderModule } from './admin-order/admin-order.module';
import { AdminCustomerModule } from './admin-customer/admin-customer.module';
import { AdminMediaModule } from './admin-media/admin-media.module';
import { AdminBlogModule } from './admin-blog/admin-blog.module';
import { AdminBundleModule } from './admin-bundle/admin-bundle.module';

@Module({
    imports: [
        AdminUserModule,
        AdminRoleModule,
        AdminAuthModule,
        AdminOrderModule,
        AdminCustomerModule,
        AdminAuthenticatorModule,
        AdminMediaModule,
        AdminBlogModule,
        AdminBundleModule,
    ],
})
export class AdminModules {}
