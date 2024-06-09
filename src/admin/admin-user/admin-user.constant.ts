import { registerEnumType } from '@nestjs/graphql';

export const ADMIN_USER_CACHE_KEY = '{adminUser}:';
export const ADMIN_USER_CACHE_TTL = 600;
export const ADMIN_USER_COLLECTION_JOINED_KEY = 'adminUsers';

export const ADMIN_BASIC_KEY = [
    'nickName',
    'username',
    'firstName',
    'lastName',
    'jobType',
    'companyId',
    'email',
];

export enum SpecialAccessType {
    ONE_TIME_USE = 'ONE_TIME_USE',
    MULTIPLE_TIME_USE = 'MULTIPLE_TIME_USE',
}
registerEnumType(SpecialAccessType, {
    name: 'SpecialAccessType',
});
