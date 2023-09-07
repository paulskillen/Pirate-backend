/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import CacheControl from 'src/setting/cache/app-cache.control';
import {
    ADMIN_USER_CACHE_KEY,
    ADMIN_USER_CACHE_TTL,
} from './admin-user.constant';
import { AdminUserService } from './admin-user.service';

const AdminUserLoader = {
    adminUser: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: AdminUserService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${ADMIN_USER_CACHE_KEY}${id[0]}`;
        });

        const instance = new CacheControl(
            cache,
            service,
            ADMIN_USER_CACHE_KEY,
            ADMIN_USER_CACHE_TTL,
        );

        const adminUserData = await instance.remember(prefixIds);

        return adminUserData;
    }),

    adminUsers: new DataLoader(async (idsServiceWithCache) => {
        let service: AdminUserService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${ADMIN_USER_CACHE_KEY}${id}`);
            });
        });

        const instance = new CacheControl(
            cache,
            service,
            ADMIN_USER_CACHE_KEY,
            ADMIN_USER_CACHE_TTL,
        );
        const adminUserData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((adminUserIds) => {
            const ids = adminUserIds[0];
            return ids.map((id) =>
                adminUserData.find(
                    (item) => item?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type AdminUserLoaderType = typeof AdminUserLoader;

export default AdminUserLoader;
