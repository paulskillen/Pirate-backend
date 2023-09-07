import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type AdminRoleDocument = AdminRole & Document;

@Schema({
  timestamps: true,
  collection: 'admin_role',
  toJSON: {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret.__v;
    },
  },
})
export class AdminRole {
  _id?: string;

  @Prop({ type: SchemaTypes.Number, required: false })
  roleNo: number;

  @Prop({ type: SchemaTypes.String, required: true, index: 'text' })
  name: string;

  @Prop({ type: SchemaTypes.Boolean, required: false, default: false })
  isAdmin: boolean;

  @Prop({ type: [{ type: SchemaTypes.String }], default: [] })
  permissions: string[];
}

export const AdminRoleSchema = SchemaFactory.createForClass(AdminRole);
