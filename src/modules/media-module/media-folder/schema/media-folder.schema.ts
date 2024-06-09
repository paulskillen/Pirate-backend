import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { AdminUser } from 'src/admin/admin-user/schemas/admin-user.schema';
import { MediaFolderStatus } from '../media-folder.constant';

export type MediaFolderDocument = MediaFolder & Document;

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
    collection: 'media_folders',
})
export class MediaFolder {
    _id?: string;

    @Prop({ type: SchemaTypes.ObjectId, default: null, required: false })
    parentId?: string;

    @Prop()
    name: string;

    @Prop({ type: () => MediaFolderStatus, default: MediaFolderStatus.ACTIVE })
    status: MediaFolderStatus;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: AdminUser.name,
        required: false,
        default: null,
    })
    createByAdmin?: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: AdminUser.name,
        required: false,
        default: null,
    })
    deleteByAdmin?: string;
}

export const MediaFolderSchema = SchemaFactory.createForClass(MediaFolder);
