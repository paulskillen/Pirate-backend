import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './schema/order.schema';
import { CustomerService } from '../customer/customer.service';
import { CustomerBasicDto } from '../customer/dto/customer.dto';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';

@Resolver(() => OrderDto)
export class OrderResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly orderService: OrderService,
        readonly customerService: CustomerService,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @ResolveField(() => CustomerBasicDto)
    async customer(
        @Parent() data: Order,
        @Context('loaders') loaders: AppLoaderType,
    ) {
        const { customer } = data;
        if (!customer) {
            return null;
        }

        const res = await loaders.customer.load([
            customer?._id,
            this.customerService,
            this.cacheManager,
        ]);
        return res;
    }
}
