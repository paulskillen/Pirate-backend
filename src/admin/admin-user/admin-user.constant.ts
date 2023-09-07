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

export enum JobTypeAdmin {
    NORMAL_EMPLOYEE = 'NORMAL_EMPLOYEE',
    DOCTOR = 'DOCTOR',
    THERAPIST = 'THERAPIST',
    NURSE = 'NURSE',
    DRIVER = 'DRIVER',
}
registerEnumType(JobTypeAdmin, {
    name: 'JobTypeAdmin',
});

export enum DateSchedule {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

registerEnumType(DateSchedule, {
    name: 'DateSchedule',
});

export enum SpecialAccessType {
    ONE_TIME_USE = 'ONE_TIME_USE',
    MULTIPLE_TIME_USE = 'MULTIPLE_TIME_USE',
}
registerEnumType(SpecialAccessType, {
    name: 'SpecialAccessType',
});

export const WEEK_DATE_TO_APP_DATE_SCHEDULE = [
    {
        id: 'MON',
        date: DateSchedule.MONDAY,
    },
    {
        id: 'TUE',
        date: DateSchedule.TUESDAY,
    },
    {
        id: 'WED',
        date: DateSchedule.WEDNESDAY,
    },
    {
        id: 'THU',
        date: DateSchedule.THURSDAY,
    },
    {
        id: 'FRI',
        date: DateSchedule.FRIDAY,
    },
    {
        id: 'SAT',
        date: DateSchedule.SATURDAY,
    },
    {
        id: 'SUN',
        date: DateSchedule.SUNDAY,
    },
];
