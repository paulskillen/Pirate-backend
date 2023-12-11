import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { OrderStatus } from 'src/modules/order/order.constant';
import { AdminRole } from '../../admin-role/schemas/admin-role.schema';
import { SpecialAccessType } from '../admin-user.constant';

@Schema({ _id: false })
class SpecialAccess {
    @Prop({ type: SchemaTypes.Boolean, required: false })
    status: boolean;

    @Prop({ type: SchemaTypes.String, required: false })
    code: string;

    @Prop({ type: SchemaTypes.Date, required: false })
    expired: Date;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        enum: SpecialAccessType,
        default: SpecialAccessType.ONE_TIME_USE,
    })
    specialAccessType: SpecialAccessType;
}
const SpecialAccessSchema = SchemaFactory.createForClass(SpecialAccess);

export type AdminUserDocument = AdminUser & Document;
@Schema({
    timestamps: true,
    collection: 'admin_user',
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class AdminUser {
    _id: string;

    @Prop({ type: SchemaTypes.Number, required: false })
    adminNo: number;

    @Prop({
        type: SchemaTypes.String,
        required: true,
        unique: true,
    })
    username: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        default: null,
    })
    firstName: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        default: null,
    })
    lastName: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        default: null,
    })
    nickName: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    email: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    avatar: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    companyId: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    password: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: false,
        default: null,
        ref: AdminRole.name,
    })
    role: string;

    @Prop({ type: SchemaTypes.Boolean, required: false, default: false })
    authenticationStatus: boolean;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    authenticationCode: string;

    @Prop({ type: SchemaTypes.Boolean, required: false, default: true })
    status: boolean;

    @Prop({
        type: [{ type: SchemaTypes.String, enum: OrderStatus }],
        required: false,
        default: [],
    })
    orderStatusManagement: OrderStatus[];

    @Prop({
        type: SpecialAccessSchema,
        required: false,
        default: null,
    })
    specialAccess: SpecialAccess;

    @Prop({ type: SchemaTypes.Date, required: false, default: null })
    lastLogin: Date;

    @Prop({ type: SchemaTypes.Date, required: false, default: null })
    lastActive: Date;
}
export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
AdminUserSchema.index({ adminNo: -1 });
AdminUserSchema.index({
    username: 'text',
    lastName: 'text',
    nickName: 'text',
    email: 'text',
    companyId: 'text',
});

@Schema({
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret.__v;
        },
    },
})
export class BaseAdminUser {
    @Prop({
        type: SchemaTypes.ObjectId,
    })
    _id?: string;

    @Prop({ type: SchemaTypes.Number, required: false })
    adminNo?: number;

    @Prop({
        type: SchemaTypes.String,
        required: true,
        index: 'text',
        unique: true,
    })
    username?: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        index: 'text',
        default: null,
    })
    firstName?: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        index: 'text',
        default: null,
    })
    lastName?: string;

    @Prop({
        type: SchemaTypes.String,
        required: false,
        index: 'text',
        default: null,
    })
    nickName?: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    email?: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    avatar?: string;

    @Prop({ type: SchemaTypes.String, required: false, default: null })
    companyId?: string;
}

export const BaseAdminUserSchema = SchemaFactory.createForClass(BaseAdminUser);
