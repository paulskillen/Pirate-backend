import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { CustomerService } from 'src/modules/customer/customer.service';

@Resolver()
export class CustomerUserResolver {
    constructor(
        @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
        readonly customerService: CustomerService,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//
}
