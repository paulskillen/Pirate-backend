import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';

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
export class Customer {
    _id: string;

    @Prop()
    avatar?: string;

    @Prop({ required: true, unique: true })
    customerNo: string;

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    nationality: string;

    @Prop({ type: SchemaTypes.String })
    phone: string;

    @Prop({ type: SchemaTypes.String })
    email: string;

    @Prop()
    lineId?: string;

    @Prop()
    instagram?: string;

    @Prop()
    facebook?: string;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ customerNo: -1 });
CustomerSchema.index({ email: 'text' });
CustomerSchema.index({ phone: 'text' });

export { CustomerSchema };

export type CustomerDocument = Customer & Document;

@ObjectType()
export class CustomerInterface {
    data: Customer[];
    pagination?: PaginateResponse;
}

CustomerSchema.plugin(mongoosePaginate);
