import { registerEnumType } from '@nestjs/graphql';

export const BLOG_CACHE_KEY = '{blog}:';
export const BLOG_CACHE_TTL = 600;
export const BLOG_PREFIX_CODE = 'BLOG';

export enum BlogStatus {
    ACTIVE = 'ACTIVE',
    IN_ACTIVE = 'IN_ACTIVE',
}

registerEnumType(BlogStatus, {
    name: 'BlogStatus',
});
