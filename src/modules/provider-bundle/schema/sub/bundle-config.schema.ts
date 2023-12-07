import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
    _id: false,
    timestamps: true,
})
export class BundleConfig {
    @Prop({ type: SchemaTypes.Number, required: false, default: null })
    price?: number;
}
export const BundleConfigSchema = SchemaFactory.createForClass(BundleConfig);
export type BundleConfigDocument = BundleConfig & Document;
