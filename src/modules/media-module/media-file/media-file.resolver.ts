import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';
import { MediaFolderService } from '../media-folder/media-folder.service';
import { MediaFileDto } from './dto/media-file.dto';
import { MediaFile } from './schema/media-file.schema';

@Resolver(() => MediaFileDto)
export class MediaFileResolver {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly mediaFolderService: MediaFolderService,
        private readonly adminUserService: AdminUserService,
    ) {}

    @ResolveField(() => String)
    async createByAdmin(
        @Parent() parent: MediaFile,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { createByAdmin } = parent || {};
        if (!createByAdmin) {
            return null;
        }
        return loaders.adminUser.load([
            createByAdmin,
            this.adminUserService,
            this.cacheManager,
        ]);
    }

    @ResolveField()
    async folder(
        @Parent() parent: MediaFile,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { folderId } = parent || {};
        if (!folderId) {
            return null;
        }
        return loaders.folder.load([
            folderId,
            this.mediaFolderService,
            this.cacheManager,
        ]);
    }
}
