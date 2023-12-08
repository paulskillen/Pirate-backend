import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminAuthorization } from 'src/admin/admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from 'src/admin/admin-auth/decorator/current-admin.decorator';
import {
    MediaFileAllResponse,
    MediaFileCreateRequest,
    MediaFileDetailResponse,
    MediaFileDto,
    MediaFilePaginateRequest,
    MediaFileUpdateRequest,
} from 'src/modules/media-module/media-file/dto/media-file.dto';
import { MediaFileService } from 'src/modules/media-module/media-file/media-file.service';
import { MediaFolderService } from 'src/modules/media-module/media-folder/media-folder.service';
import { Types } from 'mongoose';
import { PERMISSION } from 'src/common/constant/permission.constant';

@Resolver(() => MediaFileDto)
export class AdminMediaFileResolver {
    constructor(
        private readonly mediaFileService: MediaFileService,
        private readonly mediaFolderService: MediaFolderService,
    ) {}

    // ****************************** QUERY ********************************//

    @AdminAuthorization(PERMISSION.MEDIA.FILE.ALL)
    @Query(() => MediaFileAllResponse)
    async listFilesInFolderForAdmin(
        @Args('folderId', { nullable: true }) folderId: string,
        @Args('paginate') paginate: MediaFilePaginateRequest,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const query = { deleted: false };
        if (folderId) {
            const folders = await this.mediaFolderService.getAllFolderChildById(
                folderId,
                [folderId],
            );
            Object.assign(query, {
                folderId: {
                    $in: folders.map((item) => {
                        return new Types.ObjectId(item);
                    }),
                },
            });
        }
        const data = await this.mediaFileService.getAllByCondition(
            paginate,
            admin,
            query,
        );
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.DETAIL)
    @Query(() => MediaFileDetailResponse)
    async detailMediaFileForAdmin(
        @Args('id') id: string,
        @Context('loaders') loaders: any,
    ): Promise<any> {
        const data = await this.mediaFileService.findById(id);
        return { data };
    }

    // ****************************** MUTATION ********************************//

    @AdminAuthorization(PERMISSION.MEDIA.FILE.CREATE)
    @Mutation(() => MediaFileDetailResponse)
    async createMediaFileForAdmin(
        @Args('input') input: MediaFileCreateRequest,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFileService.create(input, admin);
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.UPDATE)
    @Mutation(() => MediaFileDetailResponse)
    async updateMediaFileForAdmin(
        @Args('id') id: string,
        @Args('input') input: MediaFileUpdateRequest,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFileService.update(id, input, admin);
        return { data };
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.MOVE)
    @Mutation(() => Boolean)
    async moveMediaFileForAdmin(
        @Args('fileIds', { type: () => [String] }) fileIds: string[],
        @Args('destinationId') destinationId: string,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFileService.moveMany(
            fileIds,
            destinationId,
            admin,
        );
        return true;
    }

    @AdminAuthorization(PERMISSION.MEDIA.FILE.DELETE)
    @Mutation(() => Boolean)
    async deleteMediaFileForAdmin(
        @Args('fileIds', { type: () => [String] }) fileIds: string[],
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.mediaFileService.deleteMany(fileIds, admin);
        return true;
    }
}
