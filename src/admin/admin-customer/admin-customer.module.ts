import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { AdminAuthenticatorModule } from '../admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminCustomerResolver } from './admin-customer.resolver';

@Module({
    imports: [CustomerModule, AdminRoleModule, AdminAuthenticatorModule],
    providers: [AdminCustomerResolver],
    exports: [AdminCustomerResolver, CustomerModule],
})
export class AdminCustomerModule {}
