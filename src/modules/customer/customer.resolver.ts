import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { CustomerDto, CustomerPaginateResponse } from './dto/customer.dto';
import { Customer, CustomerInterface } from './schema/customer.schema';
import { isEmpty } from 'lodash';
import { CustomerPaginateRequest } from './dto/customer.input';
import { CustomerGetter } from './customer.getter';

@Resolver(() => CustomerDto)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerGetter: CustomerGetter,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ****************************** RESOLVER FIELD ********************************//

  @Query(() => CustomerPaginateResponse)
  async listCustomerForAdmin(
    @Args('paginate') paginate: CustomerPaginateRequest,
  ): Promise<CustomerInterface> {
    return await this.customerGetter.findAll(paginate, {});
  }
}
