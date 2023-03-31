import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchedule } from 'src/common/base/base.schema';

@Schema({
    timestamps: false,
})
export class OrderCustomer extends BaseSchedule {}

export const OrderCustomerSchema = SchemaFactory.createForClass(OrderCustomer);

export type OrderCustomerDocument = OrderCustomer & Document;
