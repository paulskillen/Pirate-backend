import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { ProviderBundlePaginateResponse } from 'src/modules/provider-bundle/dto/provider-bundle.dto';
import { ProviderBundlePaginateInput } from 'src/modules/provider-bundle/dto/provider-bundle.input';
import { ProviderBundleService } from 'src/modules/provider-bundle/provider-bundle.service';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';

@Resolver()
export class AdminBundleResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly providerBundleService: ProviderBundleService,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    // ****************************** QUERIES ********************************//

    @AdminAuthorization(PERMISSION.BUNDLE.LIST)
    @Query(() => ProviderBundlePaginateResponse)
    async findAllBundleForAdmin(
        @Args('paginate') paginate: ProviderBundlePaginateInput,
        @CurrentAdmin() admin: any,
    ): Promise<ProviderBundlePaginateResponse> {
        const data = await this.providerBundleService.findAll(paginate);
        return data;
    }

    // @AdminAuthorization(PERMISSION.BUNDLE.DETAIL)
    // @Query(() => OrderDetailResponse)
    // async detailOrderForAdmin(@Args('id') id: string): Promise<any> {
    //     const data = await this.providerBundleService.findById(id);
    //     return { data };
    // }

    // // ****************************** MUTATIONS ********************************//

    // @AdminAuthorization(PERMISSION.BUNDLE.CREATE)
    // @Mutation(() => OrderDetailResponse)
    // async createOrderForAdmin(
    //     @Args('input') input: AdminOrderCreateInput,
    //     @CurrentAdmin() admin: AdminUser,
    // ): Promise<any> {
    //     const data = await this.orderService.create(input);
    //     return { data };
    // }
}
