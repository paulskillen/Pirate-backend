import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';
import { OrderStatus } from '../order.constant';
import {
    OrderContactDocument,
    OrderCustomerSchema,
    OrderCustomerDocument,
    OrderContactSchema,
    OrderProductSchema,
    OrderProductDocument,
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
    @Prop({ type: SchemaTypes.String })
    _id: string;

    @Prop({ required: true, unique: true })
    orderNo: string;

    @Prop({ type: () => ProviderName, required: true, unique: true })
    provider: ProviderName;

    @Prop({
        type: () => OrderStatus,
        required: true,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Prop({ type: () => OrderCustomerSchema, required: false })
    customer?: OrderCustomerDocument;

    @Prop({ type: () => OrderContactSchema, required: false })
    contact?: OrderContactDocument;

    @Prop({ type: () => [OrderProductSchema] })
    products: OrderProductDocument[];

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    remark: string;

    @Prop({ type: SchemaTypes.Mixed })
    payment?: any;

    @Prop({ type: SchemaTypes.Date, required: false, default: new Date() })
    expired: Date;

    @Prop({ type: SchemaTypes.ObjectId })
    createByAdmin?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orderNo: -1 });

OrderSchema.plugin(mongoosePaginate);

export type OrderDocument = Order & Document;

@ObjectType()
export class OrderInterface {
    data: Order[];
    pagination?: PaginateResponse;
}
