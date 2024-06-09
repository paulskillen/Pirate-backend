import { Module } from '@nestjs/common';
import { AdminMediaFileModule } from './admin-media-file/admin-media-file.module';
import { AdminMediaFolderModule } from './admin-media-folder/admin-media-folder.module';
import { AdminMediaUploadModule } from './admin-media-upload/admin-media-upload.module';

@Module({
    imports: [
        AdminMediaFileModule,
        AdminMediaUploadModule,
        AdminMediaFolderModule,
    ],
    exports: [
        AdminMediaFileModule,
        AdminMediaUploadModule,
        AdminMediaFolderModule,
    ],
})
export class AdminMediaModule {}
