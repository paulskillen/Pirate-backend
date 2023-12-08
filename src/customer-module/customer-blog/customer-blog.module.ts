import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { AdminBlogResolver } from './customer-blog.resolver';

@Module({
    imports: [BlogModule],
    providers: [AdminBlogResolver],
})
export class CustomerBlogModule {}
