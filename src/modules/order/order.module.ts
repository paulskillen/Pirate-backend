import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { forwardRef } from '@nestjs/common';
import { ProviderBundleModule } from '../provider-bundle/provider-bundle.module';
import { CustomerModule } from '../customer/customer.module';
import { ProviderModule } from '../provider/provider.module';
import { OrderListener } from './listener/order.listener';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        forwardRef(() => CustomerModule),
        EmailModule,
        ProviderModule,
        ProviderBundleModule,
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ],
    providers: [OrderResolver, OrderService, OrderListener],
    exports: [OrderService, OrderResolver],
})
export class OrderModule {}
