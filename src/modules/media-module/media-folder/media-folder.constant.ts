import { registerEnumType } from '@nestjs/graphql';

export const MEDIA_FOLDER_CACHE_KEY = '{media-folder}:';
export const MEDIA_FOLDER_CACHE_TTL = 600;

export enum MediaFolderStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
registerEnumType(MediaFolderStatus, {
    name: 'MediaFolderStatus',
});
