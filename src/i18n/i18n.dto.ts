import { Field, ObjectType } from '@nestjs/graphql';
import { LanguageType } from './i18n.constant';

@ObjectType()
export class TranslationDto {
    @Field(() => LanguageType)
    language: LanguageType;
}
