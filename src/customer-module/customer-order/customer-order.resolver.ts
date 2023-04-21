import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { CustomerService } from 'src/modules/customer/customer.service';
import {
    OrderCreateInput,
    OrderProcessInput,
} from 'src/modules/order/dto/order.input';
import { OrderStatus } from 'src/modules/order/order.constant';
import { OrderResolver } from 'src/modules/order/order.resolver';
import { OrderService } from 'src/modules/order/order.service';
import {
    CurrentCustomer,
    CustomerAuthorization,
} from '../customer-auth/decorators/customer-auth.decorator';
import {
    CustomerOrderDetailResponse,
    CustomerOrderDto,
    CustomerOrderPaginateResponse,
} from './dto/customer-order.dto';

@Resolver(() => CustomerOrderDto)
export class CustomerOrderResolver extends OrderResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly orderService: OrderService,
        readonly customerService: CustomerService,
    ) {
        super(cacheManager, orderService, customerService);
    }

    // ****************************** RESOLVER FIELD ********************************//

    // ****************************** QUERY ********************************//

    @CustomerAuthorization()
    @Query(() => CustomerOrderPaginateResponse)
    async historyOrderForCustomer(
        @CurrentCustomer() customer: any,
    ): Promise<any> {
        const data = await this.orderService.getAllByCondition(
            undefined,
            undefined,
            {
                'customer._id': customer?._id,
                status: {
                    $in: [OrderStatus.COMPLETED, OrderStatus.ORDER_PROCESSING],
                },
            },
        );
        return { data };
    }

    @CustomerAuthorization()
    @Query(() => CustomerOrderDetailResponse)
    async detailOrderForCustomer(@Args('id') id: string): Promise<any> {
        const data = await this.orderService.findById(id);
        return { data };
    }

    // ****************************** MUTATION ********************************//

    @CustomerAuthorization()
    @Mutation(() => CustomerOrderDetailResponse)
    async createOrderForCustomer(
        @Args('input') input: OrderCreateInput,
    ): Promise<any> {
        const data = await this.orderService.create(input);
        return { data };
    }

    @CustomerAuthorization()
    @Mutation(() => CustomerOrderDetailResponse)
    async processOrderForCustomer(
        @Args('orderId') orderId: string,
        @Args('input') input: OrderProcessInput,
    ): Promise<any> {
        const data = await this.orderService.process(orderId, input);
        return { data };
    }

    @CustomerAuthorization()
    @Mutation(() => CustomerOrderDetailResponse)
    async completeOrderForCustomer(
        @Args('orderId') orderId: string,
    ): Promise<any> {
        const data = await this.orderService.complete(orderId);
        return { data };
    }
}
