import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { AdminUser } from 'src/admin/admin-user/schemas/admin-user.schema';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { MediaFolder } from '../../media-folder/schema/media-folder.schema';

export type MediaFileDocument = MediaFile & Document;

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
    collection: 'media_files',
})
export class MediaFile {
    @Prop({ type: SchemaTypes.String, index: 'text' })
    title: string;

    @Prop({ type: SchemaTypes.String })
    description?: string;

    @Prop({ type: SchemaTypes.String, index: 'text' })
    fileName: string;

    @Prop({ type: SchemaTypes.String, index: 'text' })
    fileUrl: string;

    @Prop()
    type: string;

    @Prop()
    size: number;

    @Prop()
    dimension: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: AdminUser.name,
        required: false,
        default: null,
    })
    createByAdmin: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: AdminUser.name,
        required: false,
        default: null,
    })
    deleteByAdmin?: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: MediaFolder.name,
        required: false,
        default: null,
    })
    folderId: string;

    @Prop({ type: SchemaTypes.Boolean, default: false })
    deleted: boolean;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);

@ObjectType()
export class MediaFileInterface {
    data: MediaFile[];
    pagination?: PaginateResponse;
}
