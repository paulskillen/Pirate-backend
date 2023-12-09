import { registerEnumType } from '@nestjs/graphql';

export const STATIC_CACHE_KEY = '{static}:';
export const STATIC_CACHE_TTL = 600;
export const STATIC_PREFIX_CODE = 'STP';

export enum StaticPageTemplate {
    PRIVACY_POLICY = 'PRIVACY_POLICY',
    TERM_OF_USE = 'TERM_OF_USE',
    COMPATIBLE_DEVICES = 'COMPATIBLE_DEVICES',
    ABOUT_US = 'ABOUT_US',
    PROMOS = 'PROMOS',
}
registerEnumType(StaticPageTemplate, {
    name: 'StaticPageTemplate',
});
