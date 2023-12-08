import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { BlogStatus } from '../blog.constant';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class Blog {
    _id: string;

    @Prop({ type: SchemaTypes.String, required: true, unique: true, index: -1 })
    blogNo: string;

    @Prop({
        type: SchemaTypes.String,
        enum: BlogStatus,
        required: true,
        default: BlogStatus.ACTIVE,
    })
    status: BlogStatus;

    @Prop({ type: SchemaTypes.String, required: false })
    title: string;

    @Prop({ type: SchemaTypes.String, required: false })
    cover?: string;

    @Prop({ type: SchemaTypes.String, required: false })
    thumbnail?: string;

    @Prop({ type: SchemaTypes.String, required: false })
    fullDesc: string;

    @Prop({ type: SchemaTypes.String, required: false })
    shortDesc?: string;

    @Prop({ type: SchemaTypes.String, required: false })
    category?: string;

    @Prop({ type: Boolean, default: false })
    homePageVisibility: boolean;

    @Prop({ type: SchemaTypes.ObjectId, required: false, default: null })
    createByAdmin?: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({ templateNo: -1 });
BlogSchema.index({ name: 'text', code: 'text' });

export type BlogDocument = Blog & Document;

@ObjectType()
export class BlogInterface {
    data: Blog[];
    pagination?: PaginateResponse;
}

BlogSchema.plugin(mongoosePaginate);
