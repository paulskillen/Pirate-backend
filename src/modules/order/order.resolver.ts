import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TemplateService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './schema/order.schema';

@Resolver(() => OrderDto)
export class TemplateResolver {
    constructor(
        private readonly templateService: TemplateService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//
}
