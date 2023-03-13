import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({
  _id: false,
})
export class BaseSchedule {}

export const BaseScheduleSchema = SchemaFactory.createForClass(BaseSchedule);
