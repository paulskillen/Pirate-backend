/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import { STATIC_CACHE_KEY, STATIC_CACHE_TTL } from '../static.constant';
import { StaticService } from '../static.service';
import AppCacheControl from 'src/setting/cache/app-cache.control';

const StaticLoader = {
    staticPage: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: StaticService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${STATIC_CACHE_KEY}${id[0]}`;
        });

        const instance = new AppCacheControl(
            cache,
            service,
            STATIC_CACHE_KEY,
            STATIC_CACHE_TTL,
        );

        const templateData = await instance.remember(prefixIds);

        return templateData;
    }),

    staticPageList: new DataLoader(async (idsServiceWithCache) => {
        let service: StaticService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${STATIC_CACHE_KEY}${id}`);
            });
        });

        const instance = new AppCacheControl(
            cache,
            service,
            STATIC_CACHE_KEY,
            STATIC_CACHE_TTL,
        );
        const staticData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((templateIds) => {
            const ids = templateIds[0];
            return ids.map((id) =>
                staticData.find(
                    (user) => user?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type StaticLoaderType = typeof StaticLoader;

export default StaticLoader;
