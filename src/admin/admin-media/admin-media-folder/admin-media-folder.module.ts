import { Module } from '@nestjs/common';
import { AdminRoleModule } from 'src/admin/admin-role/admin-role.module';
import { MediaFolderModule } from 'src/modules/media-module/media-folder/media-folder.module';
import { AdminMediaFolderResolver } from './admin-media-folder.resolver';

@Module({
    imports: [MediaFolderModule, AdminRoleModule],
    providers: [AdminMediaFolderResolver],
})
export class AdminMediaFolderModule {}
