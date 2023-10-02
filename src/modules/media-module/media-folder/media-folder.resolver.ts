import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';
import { MediaFileService } from '../media-file/media-file.service';
import { MediaFolderDto } from './dto/media-folder.dto';
import { MediaFolderService } from './media-folder.service';
import { MediaFolder } from './schema/media-folder.schema';

@Resolver(() => MediaFolderDto)
export class MediaFolderResolver {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly folderService: MediaFolderService,
        private readonly mediaFileService: MediaFileService,
        private readonly adminUserService: AdminUserService,
    ) {}

    @ResolveField(() => String)
    async createByAdmin(
        @Parent() parent: MediaFolder,
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
    async size(@Parent() parent: MediaFolder): Promise<number> {
        return await this.mediaFileService.countFilesByFolderId(parent?._id);
    }

    @ResolveField()
    async parent(
        @Parent() parent: MediaFolder,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { parentId } = parent || {};
        if (!parentId) {
            return null;
        }
        return loaders.folder.load([
            parentId,
            this.folderService,
            this.cacheManager,
        ]);
    }
}
