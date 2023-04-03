import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import JSON from 'graphql-type-json';
import { SchemaTypes } from 'mongoose';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class ProviderBundle {
    @Prop(() => String)
    id: string;

    @Prop({ type: () => ProviderName })
    provider: ProviderName;

    @Prop(() => String)
    name: string;

    @Prop({ type: () => SchemaTypes.String, required: false })
    description?: string;

    @Prop({ type: () => SchemaTypes.Mixed, required: false })
    dataAmount: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false })
    duration: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false })
    price: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false })
    bundleData?: any;
}

export const ProviderBundleSchema =
    SchemaFactory.createForClass(ProviderBundle);

export type ProviderBundleDocument = ProviderBundle & Document;
