import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { PERMISSION } from 'src/common/constant/permission.constant';
import {
    OrderDetailResponse,
    OrderPaginateResponse,
} from 'src/modules/order/dto/order.dto';
import { OrderPaginateInput } from 'src/modules/order/dto/order.input';
import { OrderService } from 'src/modules/order/order.service';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';
import { AdminUser } from '../admin-user/schemas/admin-user.schema';
import { AdminOrderCreateInput } from './dto/admin-order.input';

@Resolver()
export class AdminOrderResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly orderService: OrderService,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    // ****************************** QUERIES ********************************//

    @AdminAuthorization(PERMISSION.ORDER.LIST)
    @Query(() => OrderPaginateResponse)
    async findAllOrderForAdmin(
        @Args('paginate') paginate: OrderPaginateInput,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.orderService.findAll(paginate);
        return data;
    }

    @AdminAuthorization(PERMISSION.ORDER.DETAIL)
    @Query(() => OrderDetailResponse)
    async detailOrderForAdmin(@Args('id') id: string): Promise<any> {
        const data = await this.orderService.findById(id);
        return { data };
    }

    // ****************************** MUTATIONS ********************************//

    @AdminAuthorization(PERMISSION.ORDER.CREATE)
    @Mutation(() => OrderDetailResponse)
    async createOrderForAdmin(
        @Args('input') input: AdminOrderCreateInput,
        @CurrentAdmin() admin: AdminUser,
    ): Promise<any> {
        const data = await this.orderService.create(input);
        return { data };
    }
}
