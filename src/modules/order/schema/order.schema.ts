import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus, OrderStockAdjustmentStatus } from '../order.constant';

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

    @Prop({ required: true, unique: true, index: -1 })
    orderNo: string;

    @Prop({
        type: () => OrderStatus,
        required: true,
        default: OrderStatus.ACTIVE,
    })
    status: OrderStatus;

    @Prop()
    pickupCode: string;

    @Prop()
    brandTaxId: string;

    @Prop()
    phone: string;

    @Prop({
        type: () => OrderStockAdjustmentStatus,
        required: true,
        default: OrderStockAdjustmentStatus.ALLOW,
    })
    manualStockAdjustment: OrderStockAdjustmentStatus;

    @Prop({ type: SchemaTypes.ObjectId })
    createByAdmin?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orderNo: -1 });

export type OrderDocument = Order & Document;

@ObjectType()
export class OrderInterface {
    data: Order[];
    pagination?: PaginateResponse;
}

OrderSchema.plugin(mongoosePaginate);
