import { Cache } from 'cache-manager';
import * as DataLoader from 'dataloader';
import AppCacheControl from 'src/setting/cache/app-cache.control';
import {
    MEDIA_FOLDER_CACHE_KEY,
    MEDIA_FOLDER_CACHE_TTL,
} from '../media-folder.constant';
import { MediaFolderService } from '../media-folder.service';

const MediaFolderLoader = {
    folder: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: MediaFolderService;
        const prefixIds: string[] = idsServiceWithCache.map(
            (id: any): string => {
                service = id[1];
                cache = id[2];
                return `${MEDIA_FOLDER_CACHE_KEY}${id[0]}`;
            },
        );

        const instance = new AppCacheControl(
            cache,
            service,
            MEDIA_FOLDER_CACHE_KEY,
            MEDIA_FOLDER_CACHE_TTL,
        );

        const mediaFolder = await instance.remember(prefixIds);
        return mediaFolder;
    }),

    folderList: new DataLoader(async (idsServiceWithCache) => {
        let cache: Cache;
        let service: MediaFolderService;

        const prefixIds = idsServiceWithCache.map((id) => {
            service = id[1];
            cache = id[2];
            return `${MEDIA_FOLDER_CACHE_KEY}${id[0]}`;
        });

        const instance = new AppCacheControl(
            cache,
            service,
            MEDIA_FOLDER_CACHE_KEY,
            MEDIA_FOLDER_CACHE_TTL,
        );

        const mediaFolders = await instance.remember(prefixIds, 600);

        return mediaFolders;
    }),
};

export type MediaFolderLoaderType = typeof MediaFolderLoader;

export default MediaFolderLoader;
