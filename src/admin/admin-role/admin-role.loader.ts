/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import CacheControl from 'src/setting/cache/app-cache.control';
import {
    ADMIN_ROLE_CACHE_KEY,
    ADMIN_ROLE_CACHE_TTL,
} from './admin-role.constant';
import { AdminRoleService } from './admin-role.service';

const AdminRoleLoader = {
    adminRole: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: AdminRoleService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${ADMIN_ROLE_CACHE_KEY}${id[0]}`;
        });

        const instance = new CacheControl(
            cache,
            service,
            ADMIN_ROLE_CACHE_KEY,
            ADMIN_ROLE_CACHE_TTL,
        );

        const adminRoleData = await instance.remember(prefixIds);

        return adminRoleData;
    }),

    adminRoles: new DataLoader(async (idsServiceWithCache) => {
        let service: AdminRoleService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${ADMIN_ROLE_CACHE_KEY}${id}`);
            });
        });

        const instance = new CacheControl(
            cache,
            service,
            ADMIN_ROLE_CACHE_KEY,
            ADMIN_ROLE_CACHE_TTL,
        );
        const adminRoleData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((adminRoleIds) => {
            const ids = adminRoleIds[0];
            return ids.map((id) =>
                adminRoleData.find(
                    (item) => item?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type AdminRoleLoaderType = typeof AdminRoleLoader;

export default AdminRoleLoader;
