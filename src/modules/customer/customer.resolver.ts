import { CACHE_MANAGER, Inject } from '@nestjs/common';
import {
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { AppLoaderType } from 'src/setting/cache/app-cache.module';
import { CustomerGetter } from './customer.getter';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './schema/customer.schema';

@Resolver(() => CustomerDto)
export class CustomerResolver {
    constructor(
        private readonly customerService: CustomerService,
        private readonly customerGetter: CustomerGetter,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @ResolveField(() => String)
    async id(
        @Parent() parent: Customer,
        @Context('loaders') loaders: AppLoaderType,
    ): Promise<string> {
        const { _id } = parent;
        if (!_id) {
            return null;
        }
        return _id?.toString?.();
    }
}
