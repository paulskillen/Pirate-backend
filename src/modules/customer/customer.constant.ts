import { registerEnumType } from '@nestjs/graphql';

export const CUSTOMER_CACHE_KEY = '{customer}:';
export const CUSTOMER_CACHE_TTL = 600;

export const CUSTOMER_PREFIX_CODE = 'CM';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NOT_SAY = 'NOT_SAY',
}
registerEnumType(Gender, {
  name: 'Gender',
});

export enum CustomerTitle {
  Mr = 'Mr',
  Mrs = 'Mrs',
  Miss = 'Miss',
  Ms = 'Ms',
}
registerEnumType(CustomerTitle, {
  name: 'CustomerTitle',
});
