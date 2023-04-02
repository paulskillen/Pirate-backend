import { Schema } from '@nestjs/mongoose';

@Schema({
    _id: false,
})
export class BaseSchema {}
