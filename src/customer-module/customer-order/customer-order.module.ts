import { Module } from '@nestjs/common';
import { OrderModule } from 'src/modules/order/order.module';
import { CustomerOrderResolver } from './customer-order.resolver';

@Module({
    imports: [OrderModule],
    providers: [CustomerOrderResolver],
    exports: [CustomerOrderResolver, OrderModule],
})
export class CustomerOrderModule {}
