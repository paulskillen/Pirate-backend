import { Module } from '@nestjs/common';
import { OrderModule } from 'src/modules/order/order.module';
import { AdminAuthenticatorModule } from '../admin-authenticator/admin-authenticator.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminOrderResolver } from './admin-order.resolver';

@Module({
    imports: [OrderModule, AdminRoleModule, AdminAuthenticatorModule],
    providers: [AdminOrderResolver],
    exports: [AdminOrderResolver, OrderModule],
})
export class AdminOrderModule {}
