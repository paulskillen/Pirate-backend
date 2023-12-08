import { Module } from '@nestjs/common';
import { AdminRoleModule } from 'src/admin/admin-role/admin-role.module';
import { UploadModule } from 'src/modules/media-module/upload/upload.module';
import { AdminMediaUploadResolver } from './admin-media-upload.resolver';

@Module({
    imports: [UploadModule, AdminRoleModule],
    providers: [AdminMediaUploadResolver],
})
export class AdminMediaUploadModule {}
