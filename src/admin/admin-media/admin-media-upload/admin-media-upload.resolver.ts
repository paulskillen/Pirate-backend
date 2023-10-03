import { Context, Query, Resolver, Args } from '@nestjs/graphql';
import { AdminAuthorization } from 'src/admin/admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from 'src/admin/admin-auth/decorator/current-admin.decorator';
import { PERMISSION } from 'src/common/constant/permission.constant';
import {
    GenerateUrlResponse,
    UploadResultDto,
} from 'src/modules/media-module/upload/dto/upload.dto';
import { UploadAuthType } from 'src/modules/media-module/upload/upload.constant';
import { UploadService } from 'src/modules/media-module/upload/upload.service';

@Resolver(() => UploadResultDto)
export class AdminMediaUploadResolver {
    constructor(private readonly uploadService: UploadService) {}

    // ****************************** QUERY ********************************//

    @AdminAuthorization(PERMISSION.MEDIA.UPLOAD.GET_URL)
    @Query(() => GenerateUrlResponse)
    async getUrlUploadForAdmin(
        @Args('name') name: string,
        @Context('loaders') loaders: any,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.uploadService.generateS3UrlAdmin(
            admin,
            UploadAuthType.ADMIN,
            name,
        );
        return { data: { ...data, fileName: name } };
    }
}
