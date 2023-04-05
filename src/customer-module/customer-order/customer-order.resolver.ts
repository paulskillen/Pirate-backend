import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import {
    OrderCreateInput,
    OrderProcessInput,
} from 'src/modules/order/dto/order.input';
import { OrderService } from 'src/modules/order/order.service';
import { CustomerOrderDetailResponse } from './dto/customer-order.dto';

@Resolver()
export class CustomerOrderResolver {
    constructor(
        private orderService: OrderService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Mutation(() => CustomerOrderDetailResponse)
    async createOrderForCustomer(
        @Args('input') input: OrderCreateInput,
    ): Promise<any> {
        const data = await this.orderService.create(input);
        return { data };
    }

    @Mutation(() => CustomerOrderDetailResponse)
    async processOrderForCustomer(
        @Args('orderId') orderId: string,
        @Args('input') input: OrderProcessInput,
    ): Promise<any> {
        const data = await this.orderService.process(orderId, input);
        return { data };
    }
}
