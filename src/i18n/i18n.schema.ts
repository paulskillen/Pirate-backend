import { Prop, Schema } from '@nestjs/mongoose';
import { LanguageType } from './i18n.constant';

@Schema({ _id: false })
export class Translation {
    @Prop({ type: () => LanguageType, required: true })
    language: LanguageType;
}
