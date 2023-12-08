import { forwardRef, Module } from '@nestjs/common';
import { AdminRoleModule } from 'src/admin/admin-role/admin-role.module';
import { MediaFileModule } from 'src/modules/media-module/media-file/media-file.module';
import { AdminMediaFileResolver } from './admin-media-file.resolver';
import { MediaFolderModule } from 'src/modules/media-module/media-folder/media-folder.module';

@Module({
    imports: [
        forwardRef(() => MediaFileModule),
        forwardRef(() => MediaFolderModule),
        AdminRoleModule,
    ],
    providers: [AdminMediaFileResolver],
})
export class AdminMediaFileModule {}
