import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
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
import { QUEUE_ORDER } from './order.event';
import { OrderQueue } from './queue/order.queue';
import { OrderConsumer } from './queue/order.consumer';

@Module({
    imports: [
        forwardRef(() => CustomerModule),
        BullModule.registerQueue({
            name: QUEUE_ORDER.NAME,
        }),
        EmailModule,
        ProviderModule,
        ProviderBundleModule,
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ],
    providers: [
        OrderResolver,
        OrderService,
        OrderListener,
        OrderQueue,
        OrderConsumer,
    ],
    exports: [OrderService, OrderResolver],
})
export class OrderModule {}
