import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { CustomerGetter } from 'src/modules/customer/customer.getter';
import { CustomerService } from 'src/modules/customer/customer.service';
import {
    CustomerDetailResponse,
    CustomerDto,
    CustomerPaginateResponse,
} from 'src/modules/customer/dto/customer.dto';
import {
    CustomerCreateInput,
    CustomerPaginateInput,
} from 'src/modules/customer/dto/customer.input';
import { CustomerInterface } from 'src/modules/customer/schema/customer.schema';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';

@Resolver(() => CustomerDto)
export class AdminCustomerResolver {
    constructor(
        private readonly customerService: CustomerService,
        private readonly customerGetter: CustomerGetter,
    ) {}

    // ****************************** QUERY ********************************//

    @AdminAuthorization(PERMISSION.CUSTOMER.LIST)
    @Query(() => CustomerPaginateResponse)
    async listCustomerForAdmin(
        @Args('paginate') paginate: CustomerPaginateInput,
        @CurrentAdmin() admin: any,
    ): Promise<CustomerInterface> {
        return await this.customerGetter.findAll(paginate, {});
    }

    @AdminAuthorization(PERMISSION.CUSTOMER.SEARCH)
    @Query(() => CustomerPaginateResponse)
    async searchCustomerForAdmin(
        @Args('paginate') paginate: CustomerPaginateInput,
        @CurrentAdmin() admin: any,
    ): Promise<CustomerInterface> {
        return await this.customerGetter.findAll(paginate, {});
    }

    @AdminAuthorization(PERMISSION.CUSTOMER.DETAIL)
    @Query(() => CustomerDetailResponse)
    async detailCustomerForAdmin(
        @Args('id', { type: () => String }) id: string,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.customerGetter.findById(id);
        return { data };
    }

    // ****************************** MUTATION ********************************//

    @AdminAuthorization(PERMISSION.CUSTOMER.CREATE)
    @Mutation(() => CustomerDetailResponse)
    async createCustomerForAdmin(
        @Args('input') input: CustomerCreateInput,
        @CurrentAdmin() admin: any,
    ) {
        const data = await this.customerService.create(input, admin);
        return { data };
    }
}
