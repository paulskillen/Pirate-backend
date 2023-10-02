import { Resolver } from '@nestjs/graphql';
import { UploadResultDto } from './dto/upload.dto';
import { UploadService } from './upload.service';

@Resolver(() => UploadResultDto)
export class UploadResolver {
    constructor(
        private uploadService: UploadService,
        private uploadS3Service: UploadService,
    ) {}

    //   @Mutation(() => UploadFileResultDto)
    //   async uploadFile(
    //     @Args('file', { type: () => GraphQLUpload })
    //     file: FileUpload,
    //     @Args('type', { type: () => UploadAuthType, nullable: true })
    //     type: UploadAuthType,
    //     @CurrentUser() auth: any,
    //   ): Promise<ResultFileUpload | boolean> {
    //     return this.uploadS3Service.storeFileToS3(file, type, auth);
    //   }

    //   @Query((returns) => UrlUploadFileS3Dto)
    //   async getUrlUploadFileS3(@CurrentUser() auth: any): Promise<any> {
    //     const res = await this.uploadS3Service.getUrlUploadFileS3({ auth });
    //     return res;
    //   }

    //   @Mutation(() => [UploadFileResultDto])
    //   async uploadMultiFiles(
    //     @Args('files', { type: () => [GraphQLUpload] })
    //     files: Promise<FileUpload>[],
    //     @Args('type', { type: () => UploadAuthType, nullable: true })
    //     type: UploadAuthType,
    //     @CurrentUser() auth: any,
    //   ): Promise<ResultFileUpload[]> {
    //     return await this.uploadS3Service.storeMultipleFileToS3(files, type, auth);
    //   }

    //   @Mutation(() => FileDeleteResultDto)
    //   async deleteImage(
    //     @Args('filename', { type: () => String }) filename: string,
    //     @Args('type', { type: () => String }) type: string,
    //   ): Promise<ResultFileDeleted> {
    //     try {
    //       this.uploadService.removeFile(filename, type);
    //       return { filename, deleted: true };
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
}
