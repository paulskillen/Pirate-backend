import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminAuthorization } from 'src/admin/admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from 'src/admin/admin-auth/decorator/current-admin.decorator';
import { PERMISSION } from 'src/common/constant/permission.constant';
import {
    MediaFolderAllResponse,
    MediaFolderCreateInput,
    MediaFolderDto,
    MediaFolderPaginateInput,
    MediaFolderUpdateInput,
} from 'src/modules/media-module/media-folder/dto/media-folder.dto';
import { MediaFolderService } from 'src/modules/media-module/media-folder/media-folder.service';

@Resolver(() => MediaFolderDto)
export class AdminMediaFolderResolver {
    constructor(private readonly mediaFolderService: MediaFolderService) {}

    // ****************************** QUERY ********************************//

    @AdminAuthorization(PERMISSION.MEDIA.FOLDER.ALL)
    @Query(() => MediaFolderAllResponse)
    async allMediaFolderForAdmin(
        @Args('paginate') paginate: MediaFolderPaginateInput,
        @CurrentAdmin() admin: any,
        @Context('loaders') loaders: any,
    ): Promise<any> {
        const data = await this.mediaFolderService.getAll(paginate, admin);
        return { data };
    }

    //   @AdminAuthorization(PERMISSION.MEDIA.FOLDER.ALL)
    //   @Query(() => MediaFolderAllResponse)
    //   async allMediaFolderTreeForAdmin(
    //     @Args('id') id: string,
    //     @Context('loaders') loaders: any,
    //   ): Promise<any> {
    //     const data = await this.mediaFolderService.getFolderTree();
    //     return { data };
    //   }

    // ****************************** MUTATION ********************************//

    @AdminAuthorization(PERMISSION.MEDIA.FOLDER.CREATE)
    @Mutation(() => MediaFolderAllResponse)
    async createMediaFolderForAdmin(
        @Args('input') input: MediaFolderCreateInput,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFolderService.create(input, admin);
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.UPDATE)
    @Mutation(() => MediaFolderAllResponse)
    async updateMediaFolderForAdmin(
        @Args('folderId') folderId: string,
        @Args('input') input: MediaFolderUpdateInput,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFolderService.update(
            folderId,
            input,
            admin,
        );
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.MOVE)
    @Mutation(() => MediaFolderAllResponse)
    async moveMediaFolderForAdmin(
        @Args('folderId') folderId: string,
        @Args('parentId', { nullable: true }) parentId: string,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFolderService.move(
            folderId,
            parentId,
            admin,
        );
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.DELETE)
    @Mutation(() => MediaFolderAllResponse)
    async deleteMediaFolderForAdmin(
        @Args('fileId') fileId: string,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFolderService.delete(fileId, admin);
        return { data };
    }
}
