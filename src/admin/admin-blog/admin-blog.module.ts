import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminBlogResolver } from './admin-blog.resolver';

@Module({
    imports: [AdminAuthModule, AdminRoleModule, BlogModule],
    providers: [AdminBlogResolver],
})
export class AdminBlogModule {}
