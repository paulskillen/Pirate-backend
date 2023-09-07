import { registerEnumType } from '@nestjs/graphql';

export const ADMIN_AUTH_EXPIRED_AFTER_HOURS = 24;
export enum Device {
    APP = 'APP',
    WEBSITE = 'WEBSITE',
}
registerEnumType(Device, {
    name: 'Device',
});
