import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaFile, MediaFileSchema } from './schema/media-file.schema';
import { MediaFileService } from './media-file.service';
import { MediaFileResolver } from './media-file.resolver';
import { MediaFolderModule } from '../media-folder/media-folder.module';
import { AdminUserModule } from 'src/admin/admin-user/admin-user.module';

@Module({
    imports: [
        forwardRef(() => MediaFolderModule),
        forwardRef(() => AdminUserModule),
        CacheModule.register(),
        MongooseModule.forFeature([
            {
                name: MediaFile.name,
                schema: MediaFileSchema,
            },
        ]),
    ],
    providers: [MediaFileService, MediaFileResolver],
    exports: [MediaFileService],
})
export class MediaFileModule {}
