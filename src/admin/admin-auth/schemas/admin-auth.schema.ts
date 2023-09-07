import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Device } from '../admin-auth.constant';

export type AdminAuthDocument = AdminAuth & Document;

@Schema({
    timestamps: true,
    collection: 'admin_auth',
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class AdminAuth {
    @Prop({
        type: SchemaTypes.String,
        enum: Device,
        required: true,
    })
    device: Device;

    @Prop({ type: SchemaTypes.ObjectId })
    adminId: string;

    @Prop({ type: SchemaTypes.Date })
    expiresIn: Date;
}

export const AdminAuthSchema = SchemaFactory.createForClass(AdminAuth);
