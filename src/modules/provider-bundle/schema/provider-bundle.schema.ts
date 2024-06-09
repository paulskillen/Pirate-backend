import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProviderName } from 'src/modules/provider/provider.constant';
import { BundleConfig, BundleConfigSchema } from './sub/bundle-config.schema';

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

    @Prop({ type: () => String, required: true, unique: true })
    refId: string;

    @Prop({ type: () => ProviderName, required: false })
    provider: ProviderName;

    @Prop({ type: () => String, required: true })
    name: string;

    @Prop({ type: () => SchemaTypes.String, required: false, default: null })
    description?: string;

    @Prop({ type: () => SchemaTypes.Mixed, required: false, default: null })
    dataAmount: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false, default: null })
    duration: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false, default: null })
    price: any;

    @Prop({ type: () => SchemaTypes.Mixed, required: false, default: null })
    bundleData?: any;

    @Prop({ type: BundleConfigSchema, required: false })
    config?: BundleConfig;
}

export const ProviderBundleSchema =
    SchemaFactory.createForClass(ProviderBundle);

export type ProviderBundleDocument = ProviderBundle & Document;
