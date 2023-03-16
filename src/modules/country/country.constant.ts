import { registerEnumType } from '@nestjs/graphql';
import * as dotenv from 'dotenv';

dotenv.config();

export const COUNTRY_CACHE_KEY = '{country_cache_key}:';
export const COUNTRY_CACHE_TTL = 600;
export const COUNTRY_PREFIX_CODE = 'CY';

export const COUNTRY_SUPPORTED_LIST_ISO = ['GB', 'ES', 'FR', 'IT', 'GR', 'NL'];

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NOT_SAY = 'NOT_SAY',
}
registerEnumType(Gender, {
    name: 'Gender',
});
