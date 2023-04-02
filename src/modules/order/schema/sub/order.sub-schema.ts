import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseSchema } from 'src/common/base/base.schema';

@Schema({
    _id: false,
    timestamps: false,
})
export class OrderCustomer extends BaseSchema {}
export const OrderCustomerSchema = SchemaFactory.createForClass(OrderCustomer);
export type OrderCustomerDocument = OrderCustomer & Document;

@Schema({ _id: false, timestamps: false })
export class OrderContact {
    @Prop({ type: SchemaTypes.String, required: false })
    firstName: string;

    @Prop({ type: SchemaTypes.String, required: false })
    lastName: string;

    @Prop({ type: SchemaTypes.String, required: true })
    email: string;

    @Prop({ type: SchemaTypes.String, required: false })
    phone?: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
    })
    phoneCode?: string;

    @Prop({ type: SchemaTypes.Boolean, required: false, default: false })
    hasCreateNewCustomer?: boolean;
}
export const OrderContactSchema = SchemaFactory.createForClass(OrderContact);
export type OrderContactDocument = OrderCustomer & Document;

@Schema({ _id: false, timestamps: false })
export class OrderProduct {
    @Prop({ type: SchemaTypes.String, required: true })
    product: string;

    @Prop({ type: SchemaTypes.Number, required: false, default: 1 })
    quantity: number;
}
export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
export type OrderProductDocument = OrderProduct & Document;

@Schema({ _id: false, timestamps: false })
export class OrderPayment {
    @Prop({ type: SchemaTypes.String, required: true })
    product: string;

    @Prop({ type: SchemaTypes.Number, required: false, default: 1 })
    quantity: number;
}
export const OrderPaymentSchema = SchemaFactory.createForClass(OrderProduct);
export type OrderPaymentDocument = OrderPayment & Document;
