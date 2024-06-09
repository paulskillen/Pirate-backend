import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { BlogService } from 'src/modules/blog/blog.service';
import {
    BlogDetailResponse,
    BlogPaginateResponse,
} from 'src/modules/blog/dto/blog.dto';
import {
    BlogCreateRequest,
    BlogPaginateRequest,
    BlogUpdateRequest,
} from 'src/modules/blog/dto/blog.input';
import { BlogInterface } from 'src/modules/blog/schema/blog.schema';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';

@Resolver()
export class AdminBlogResolver {
    constructor(private readonly blogService: BlogService) {}

    @AdminAuthorization(PERMISSION.BLOG.LIST)
    @Query(() => BlogPaginateResponse)
    async listBlogForAdmin(
        @Args('paginate') paginate: BlogPaginateRequest,
        @CurrentAdmin() admin: any,
    ): Promise<BlogInterface> {
        return this.blogService.findAll(paginate, admin);
    }

    @AdminAuthorization(PERMISSION.BLOG.DETAIL)
    @Query(() => BlogDetailResponse)
    async detailBlogForAdmin(@Args('id') id: string): Promise<any> {
        const data = this.blogService.findById(id);
        return { data };
    }

    @AdminAuthorization(PERMISSION.BLOG.CREATE)
    @Mutation(() => BlogDetailResponse)
    async createBlogForAdmin(
        @Args('payload') payload: BlogCreateRequest,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.blogService.create(payload, admin);
        return { data };
    }

    @AdminAuthorization(PERMISSION.BLOG.UPDATE)
    @Mutation(() => BlogDetailResponse)
    async updateBlogForAdmin(
        @Args('id') id: string,
        @Args('payload') payload: BlogUpdateRequest,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.blogService.update(id, payload, admin);
        return { data };
    }
}
