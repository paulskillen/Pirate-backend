import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';
import { OrderStatus, OrderType } from '../order.constant';
import {
    OrderContactDocument,
    OrderCustomerSchema,
    OrderCustomerDocument,
    OrderContactSchema,
    OrderProductSchema,
    OrderProductDocument,
    OrderPaymentSchema,
    OrderPaymentDocument,
    OrderFeeSchema,
    OrderFeeDocument,
    OrderESimDataDocument,
    OrderESimDataSchema,
} from './sub/order.sub-schema';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class Order {
    _id: string;

    @Prop({ type: () => SchemaTypes.String, required: true, unique: true })
    orderNo: string;

    @Prop({
        type: () => OrderType,
        required: false,
        default: OrderType.BUY_NEW,
    })
    orderType?: OrderType;

    @Prop({
        type: () => OrderStatus,
        required: true,
        default: OrderStatus.PENDING_PAYMENT,
    })
    status: OrderStatus;

    @Prop({ type: () => OrderCustomerSchema, required: false })
    customer: OrderCustomerDocument;

    @Prop({ type: () => OrderContactSchema, required: false })
    contact?: OrderContactDocument;

    @Prop({ type: () => [OrderProductSchema], required: false, default: [] })
    products?: OrderProductDocument[];

    @Prop({ type: () => OrderPaymentSchema, required: false, default: null })
    payment?: OrderPaymentDocument[];

    @Prop({ type: SchemaTypes.Date, required: false, default: new Date() })
    expiryDate?: Date;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    remark?: string;

    @Prop({ type: SchemaTypes.ObjectId })
    createByAdmin?: string;

    @Prop({ type: SchemaTypes.Number, required: true, default: 0 })
    subTotal: number;

    @Prop({ type: SchemaTypes.Number, required: true, default: 0 })
    total: number;

    @Prop({
        type: [OrderFeeSchema],
        required: false,
        default: [],
    })
    fee?: OrderFeeDocument[];

    @Prop({ type: () => ProviderName })
    provider: ProviderName;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    refOrder?: string;

    @Prop({ type: SchemaTypes.Mixed, required: false, default: null })
    providerOrder?: any;

    @Prop({ type: OrderESimDataSchema, required: false, default: null })
    eSimData?: OrderESimDataDocument;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orderNo: -1 });
OrderSchema.index({ 'customer._id': -1 });

OrderSchema.plugin(mongoosePaginate);

export type OrderDocument = Order & Document;

@ObjectType()
export class OrderInterface {
    data: Order[];
    pagination?: PaginateResponse;
}
