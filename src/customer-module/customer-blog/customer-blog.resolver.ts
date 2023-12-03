import { Args, Query, Resolver } from '@nestjs/graphql';
import { BlogStatus } from 'src/modules/blog/blog.constant';
import { BlogService } from 'src/modules/blog/blog.service';
import {
    BlogDetailResponse,
    BlogPaginateResponse,
} from 'src/modules/blog/dto/blog.dto';
import { BlogPaginateRequest } from 'src/modules/blog/dto/blog.input';
import { BlogInterface } from 'src/modules/blog/schema/blog.schema';

@Resolver()
export class AdminBlogResolver {
    constructor(private readonly blogService: BlogService) {}

    @Query(() => BlogPaginateResponse)
    async listBlogForCustomer(
        @Args('paginate') paginate: BlogPaginateRequest,
    ): Promise<BlogInterface> {
        return this.blogService.findAll(paginate);
    }

    @Query(() => BlogDetailResponse)
    async detailBlogForCustomer(@Args('id') id: string): Promise<any> {
        const data = this.blogService.findById(id);
        return { data };
    }

    @Query(() => BlogPaginateResponse)
    async getHomepageBlogsForCustomer(): Promise<any> {
        const data = await this.blogService.getAllByCondition(
            {
                homePageVisibility: true,
                status: [BlogStatus.ACTIVE],
            },
            undefined,
            { sort: { updatedAt: 1, _id: -1 } },
        );
        return { data };
    }
}
