import { Module } from '@nestjs/common';
import { OrderModule } from 'src/modules/order/order.module';
import { CustomerUserModule } from '../customer-user/customer-user.module';
import { CustomerOrderResolver } from './customer-order.resolver';

@Module({
    imports: [OrderModule, CustomerUserModule],
    providers: [CustomerOrderResolver],
    exports: [CustomerOrderResolver, OrderModule],
})
export class CustomerOrderModule {}
