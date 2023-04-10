import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { CustomerStatus, CustomerTitle, Gender } from '../customer.constant';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
        virtuals: true,
    },
})
export class BaseCustomer {
    _id: string;

    @Prop()
    id?: string;

    @Prop({ type: SchemaTypes.String, required: true, unique: true })
    customerNo: string;

    @Prop({
        type: () => CustomerStatus,
        required: true,
        default: CustomerStatus.ACTIVE,
    })
    status?: CustomerStatus;

    @Prop()
    avatar?: string;

    @Prop()
    socialId?: string;

    @Prop({
        type: () => CustomerTitle,
        required: false,
    })
    title: CustomerTitle;

    @Prop({ required: false })
    firstName: string;

    @Prop({ required: false })
    lastName: string;

    @Prop({ required: false })
    nickname: string;

    @Prop({ type: () => Gender, required: false })
    gender?: Gender;

    @Prop({ type: SchemaTypes.Date, required: false })
    birthDay?: Date;

    // contact information

    @Prop({ type: SchemaTypes.String, required: true, unique: true })
    email: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
    })
    phoneCode?: string;

    @Prop({ type: SchemaTypes.String, required: false })
    phone?: string;
}

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
        virtuals: true,
    },
})
export class Customer extends BaseCustomer {
    @Prop({ type: SchemaTypes.ObjectId, required: false })
    nationality?: string;

    @Prop()
    lineId?: string;

    @Prop()
    instagram?: string;

    @Prop()
    facebook?: string;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ customerNo: -1 });
CustomerSchema.index({ email: 'text', phone: 'text' });

export { CustomerSchema };

export type CustomerDocument = Customer & Document;

@ObjectType()
export class CustomerInterface {
    data: Customer[];
    pagination?: PaginateResponse;
}

CustomerSchema.plugin(mongoosePaginate);
