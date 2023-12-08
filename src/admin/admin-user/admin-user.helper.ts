/* eslint-disable @typescript-eslint/ban-ts-comment */

import { AdminUser } from './schemas/admin-user.schema';

export const ADMIN_USERS_SEARCH_FIELDS: Array<string> = [
    'username',
    'firstName',
    'lastName',
    'email',
    'nickName',
];
export class AdminUserHelper {
    static checkIsAdmin = (admin: AdminUser): boolean => {
        return !!admin?.adminNo ?? null;
    };
}
