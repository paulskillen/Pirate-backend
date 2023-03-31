/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import CacheControl from 'src/setting/cache/app-cache.control';
import { ORDER_CACHE_KEY, ORDER_CACHE_TTL } from '../order.constant';
import { TemplateService } from '../order.service';

const OrderLoader = {
    order: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: TemplateService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${ORDER_CACHE_KEY}${id[0]}`;
        });

        const instance = new CacheControl(
            cache,
            service,
            ORDER_CACHE_KEY,
            ORDER_CACHE_TTL,
        );

        const loadedData = await instance.remember(prefixIds);

        return loadedData;
    }),

    orderList: new DataLoader(async (idsServiceWithCache) => {
        let service: TemplateService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${ORDER_CACHE_KEY}${id}`);
            });
        });

        const instance = new CacheControl(
            cache,
            service,
            ORDER_CACHE_KEY,
            ORDER_CACHE_TTL,
        );
        const loadedData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((templateIds) => {
            const ids = templateIds[0];
            return ids.map((id) =>
                loadedData.find(
                    (user) => user?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type OrderLoaderType = typeof OrderLoader;

export default OrderLoader;
