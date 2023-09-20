import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { CustomerService } from 'src/modules/customer/customer.service';
import {
    CustomerDetailResponse,
    CustomerPaginateResponse,
} from 'src/modules/customer/dto/customer.dto';
import { CustomerPaginateInput } from 'src/modules/customer/dto/customer.input';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';
import { AdminUser } from '../admin-user/schemas/admin-user.schema';
import { AdminCustomerCreateInput } from './dto/admin-customer.input';

@Resolver()
export class AdminCustomerResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly customerService: CustomerService,
    ) {}

    // ****************************** QUERIES ********************************//

    @AdminAuthorization(PERMISSION.CUSTOMER.LIST)
    @Query(() => CustomerPaginateResponse)
    async findAllOrderForAdmin(
        @Args('paginate') paginate: CustomerPaginateInput,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.customerService.findAll(paginate);
        return { data };
    }

    @AdminAuthorization(PERMISSION.CUSTOMER.DETAIL)
    @Query(() => CustomerDetailResponse)
    async detailCustomerForAdmin(@Args('id') id: string): Promise<any> {
        const data = await this.customerService.findById(id);
        return { data };
    }

    // ****************************** MUTATIONS ********************************//

    @AdminAuthorization(PERMISSION.CUSTOMER.CREATE)
    @Mutation(() => CustomerDetailResponse)
    async createOrderForAdmin(
        @Args('input') input: AdminCustomerCreateInput,
        @CurrentAdmin() admin: AdminUser,
    ): Promise<any> {
        const data = await this.customerService.create(input);
        return { data };
    }
}
