import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { AdminUserModule } from 'src/admin/admin-user/admin-user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
        AdminUserModule,
    ],
    providers: [BlogResolver, BlogService],
    exports: [BlogService],
})
export class BlogModule {}
