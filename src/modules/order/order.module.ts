import { Module } from '@nestjs/common';
import { TemplateService } from './order.service';
import { TemplateResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { forwardRef } from '@nestjs/common';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ],
    providers: [TemplateResolver, TemplateService],
    exports: [TemplateService],
})
export class BranchModule {}
