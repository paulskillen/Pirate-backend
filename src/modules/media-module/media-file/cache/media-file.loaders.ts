import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import AppCacheControl from 'src/setting/cache/app-cache.control';
import {
    MEDIA_FILE_CACHE_KEY,
    MEDIA_FILE_CACHE_TTL,
} from '../media-file.constant';
import { MediaFileService } from '../media-file.service';

const MediaFileLoader = {
    mediaFile: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: MediaFileService;
        const prefixIds: string[] = idsServiceWithCache.map(
            (id: any): string => {
                service = id[1];
                cache = id[2];
                return `${MEDIA_FILE_CACHE_KEY}${id[0]}`;
            },
        );

        const instance = new AppCacheControl(
            cache,
            service,
            MEDIA_FILE_CACHE_KEY,
            MEDIA_FILE_CACHE_TTL,
        );

        const mediaFile = await instance.remember(prefixIds);
        return mediaFile;
    }),

    mediaFiles: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: MediaFileService;
        let q = '';
        const prefixIds: string[] = idsServiceWithCache.map(
            (id: any): string => {
                service = id[1];
                cache = id[2];
                q = id[3];
                return `${MEDIA_FILE_CACHE_KEY}${id[0]}query:${q}`;
            },
        );

        const instance = new AppCacheControl(
            cache,
            service,
            MEDIA_FILE_CACHE_KEY,
            MEDIA_FILE_CACHE_TTL,
        );

        const mediaFiles = await instance.remember(prefixIds);

        return mediaFiles;
    }),
};

export type MediaFileLoaderType = typeof MediaFileLoader;

export default MediaFileLoader;
