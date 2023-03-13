import { registerEnumType } from '@nestjs/graphql';

export enum LanguageType {
  en = 'en',
  th = 'th',
}

registerEnumType(LanguageType, {
  name: 'LocalizeType',
});

export const DEFAULT_LANGUAGE = LanguageType.en;
