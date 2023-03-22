/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import { ESIM_GO_CACHE_KEY, ESIM_GO_CACHE_TTL } from '../eSimGo.constant';
import { ESimGoService } from '../eSimGo.service';
import AppCacheControl from 'src/setting/cache/app-cache.control';

const EsimGoLoader = {
    esim: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: ESimGoService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${ESIM_GO_CACHE_KEY}${id[0]}`;
        });

        const instance = new AppCacheControl(
            cache,
            service,
            ESIM_GO_CACHE_KEY,
            ESIM_GO_CACHE_TTL,
        );

        const cacheData = await instance.remember(prefixIds);

        return cacheData;
    }),

    esimList: new DataLoader(async (idsServiceWithCache) => {
        let service: ESimGoService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${ESIM_GO_CACHE_KEY}${id}`);
            });
        });

        const instance = new AppCacheControl(
            cache,
            service,
            ESIM_GO_CACHE_KEY,
            ESIM_GO_CACHE_TTL,
        );
        const cacheData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((equipmentIds) => {
            const ids = equipmentIds[0];
            return ids.map((id) =>
                cacheData.find(
                    (user) => user?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type EsimGoLoaderType = typeof EsimGoLoader;

export default EsimGoLoader;
