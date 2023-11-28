/* eslint-disable prefer-destructuring */
import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import AppCacheControl from 'src/setting/cache/app-cache.control';
import { BLOG_CACHE_KEY, BLOG_CACHE_TTL } from '../blog.constant';
import { BlogService } from '../blog.service';

const BlogLoader = {
    blog: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: BlogService;
        const prefixIds: any[] = idsServiceWithCache.map((id: any): any => {
            service = id[1];
            cache = id[2];
            return `${BLOG_CACHE_KEY}${id[0]}`;
        });
        const instance = new AppCacheControl(
            cache,
            service,
            BLOG_CACHE_KEY,
            BLOG_CACHE_TTL,
        );
        const blogData = await instance.remember(prefixIds);
        return blogData;
    }),

    blogList: new DataLoader(async (idsServiceWithCache) => {
        let service: BlogService;
        let cache: Cache;
        const prefixIds: string[] = [];
        idsServiceWithCache.forEach((id) => {
            service = id[1];
            cache = id[2];
            id[0].forEach((id: string) => {
                prefixIds.push(`${BLOG_CACHE_KEY}${id}`);
            });
        });

        const instance = new AppCacheControl(
            cache,
            service,
            BLOG_CACHE_KEY,
            BLOG_CACHE_TTL,
        );
        const blogData = await instance.remember(prefixIds);

        return idsServiceWithCache.map((templateIds) => {
            const ids = templateIds[0];
            return ids.map((id) =>
                blogData.find(
                    (user) => user?._id?.toString?.() === id?.toString?.(),
                ),
            );
        });
    }),
};

export type BlogLoaderType = typeof BlogLoader;

export default BlogLoader;
