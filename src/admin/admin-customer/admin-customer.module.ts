import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminCustomerResolver } from './admin-customer.resolver';

@Module({
    imports: [CustomerModule, AdminRoleModule, AdminAuthModule],
    providers: [AdminCustomerResolver],
    exports: [CustomerModule],
})
export class AdminCustomerModule {}
