import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { StaticPageTemplate } from '../static.constant';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class StaticPage {
    _id: string;

    @Prop({
        type: SchemaTypes.String,
        enum: StaticPageTemplate,
        required: true,
        unique: true,
    })
    template: StaticPageTemplate;

    @Prop({ type: SchemaTypes.String, required: false })
    title: string;

    @Prop({ type: SchemaTypes.String, required: false })
    subTitle: string;

    @Prop({ type: SchemaTypes.String, required: true })
    content: string;

    @Prop({ type: SchemaTypes.ObjectId, required: false, default: null })
    updatedByAdmin?: string;
}

export const StaticPageSchema = SchemaFactory.createForClass(StaticPage);

StaticPageSchema.index({ template: -1 });
StaticPageSchema.index({ title: 'text', subTitle: 'text' });

export type StaticPageDocument = StaticPage & Document;

@ObjectType()
export class StaticPageInterface {
    data: StaticPage[];
    pagination?: PaginateResponse;
}

StaticPageSchema.plugin(mongoosePaginate);
