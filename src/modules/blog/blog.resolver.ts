import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { BlogDto } from './dto/blog.dto';
import { Blog } from './schema/blog.schema';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { AdminUserBasicDto } from 'src/admin/admin-user/dto/admin-user.dto';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';

@Resolver(() => BlogDto)
export class BlogResolver {
    constructor(
        private readonly blogService: BlogService,
        private readonly adminUserService: AdminUserService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @ResolveField(() => AdminUserBasicDto, { nullable: true })
    async createByAdmin(
        @Parent() parent: Blog,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { createByAdmin } = parent;
        if (!createByAdmin) {
            return null;
        }
        return loaders.adminUser.load([
            createByAdmin,
            this.adminUserService,
            this.cacheManager,
        ]);
    }
}
