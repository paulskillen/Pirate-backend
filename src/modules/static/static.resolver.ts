import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { StaticService } from './static.service';
import { StaticDto } from './dto/static.dto';
import { StaticPage } from './schema/static.schema';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { AdminUserBasicDto } from 'src/admin/admin-user/dto/admin-user.dto';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';

@Resolver(() => StaticDto)
export class StaticResolver {
    constructor(
        private readonly staticService: StaticService,
        private readonly adminUserService: AdminUserService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @ResolveField(() => AdminUserBasicDto, { nullable: true })
    async updatedByAdmin(
        @Parent() parent: StaticPage,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<any> {
        const { updatedByAdmin: createByAdmin } = parent;
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
