import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseCustomer } from 'src/modules/customer/schema/customer.schema';
import {
    ProviderBundleDocument,
    ProviderBundleSchema,
} from 'src/modules/provider-bundle/schema/provider-bundle.schema';
import { OrderPaymentStatus, PaymentMethod } from '../../order.constant';

@Schema({
    _id: false,
    timestamps: false,
})
export class OrderCustomer extends BaseCustomer {}
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
    @Prop({ type: () => ProviderBundleSchema, required: true })
    product: ProviderBundleDocument;

    @Prop({ type: SchemaTypes.Number, required: false, default: 1 })
    quantity: number;
}
export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
export type OrderProductDocument = OrderProduct & Document;

@Schema({ _id: false, timestamps: false })
export class OrderPayment {
    @Prop({ type: () => SchemaTypes.Mixed, required: false, default: null })
    paymentData?: any;

    @Prop({ type: () => PaymentMethod, required: true })
    method: PaymentMethod;

    @Prop({ type: SchemaTypes.Date, required: false, default: null })
    createdAt: Date;

    @Prop({ type: SchemaTypes.Date, required: false, default: null })
    updatedAt: Date;

    @Prop({
        type: () => OrderPaymentStatus,
        required: true,
        default: OrderPaymentStatus.PENDING,
    })
    status: OrderPaymentStatus;
}
export const OrderPaymentSchema = SchemaFactory.createForClass(OrderProduct);
export type OrderPaymentDocument = OrderPayment & Document;

@Schema({ _id: false })
export class OrderFee {
    @Prop({ type: SchemaTypes.String, required: true })
    name: string;

    @Prop({ type: SchemaTypes.Number, required: false, default: 0 })
    total: number;
}

export const OrderFeeSchema = SchemaFactory.createForClass(OrderFee);
