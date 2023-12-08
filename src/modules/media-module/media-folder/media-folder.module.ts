import { forwardRef } from '@nestjs/common';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserModule } from 'src/admin/admin-user/admin-user.module';
import { MediaFileModule } from '../media-file/media-file.module';
import { MediaFolderResolver } from './media-folder.resolver';
import { MediaFolderService } from './media-folder.service';
import { MediaFolder, MediaFolderSchema } from './schema/media-folder.schema';

@Module({
    imports: [
        CacheModule.register(),
        MongooseModule.forFeature([
            { name: MediaFolder.name, schema: MediaFolderSchema },
        ]),
        forwardRef(() => MediaFileModule),
        forwardRef(() => AdminUserModule),
    ],
    providers: [MediaFolderResolver, MediaFolderService],
    exports: [MediaFolderService],
})
export class MediaFolderModule {}
