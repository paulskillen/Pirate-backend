/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import CacheControl from 'src/setting/cache/app-cache.control';
import { CUSTOMER_CACHE_KEY, CUSTOMER_CACHE_TTL } from '../customer.constant';
import { CustomerService } from '../customer.service';

const CustomerLoader = {
    customer: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: CustomerService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${CUSTOMER_CACHE_KEY}${id[0]}`;
        });

        const instance = new CacheControl(
            cache,
            service,
            CUSTOMER_CACHE_KEY,
            CUSTOMER_CACHE_TTL,
        );

        const loadedData = await instance.remember(prefixIds);

        return loadedData;
    }),

    customerList: new DataLoader(async (idsServiceWithCache) => {
        let service: CustomerService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${CUSTOMER_CACHE_KEY}${id}`);
            });
        });

        const instance = new CacheControl(
            cache,
            service,
            CUSTOMER_CACHE_KEY,
            CUSTOMER_CACHE_TTL,
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

export type CustomerLoaderType = typeof CustomerLoader;

export default CustomerLoader;
