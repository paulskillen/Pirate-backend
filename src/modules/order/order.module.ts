import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { forwardRef } from '@nestjs/common';
import { ProviderBundleModule } from '../provider-bundle/provider-bundle.module';
import { CustomerModule } from '../customer/customer.module';
import { ProviderModule } from '../provider/provider.module';

@Module({
    imports: [
        CustomerModule,
        ProviderModule,
        ProviderBundleModule,
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ],
    providers: [OrderResolver, OrderService],
    exports: [OrderService],
})
export class OrderModule {}
