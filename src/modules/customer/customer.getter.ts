import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
// import { CustomerHelper } from './customer.helper';
import { PaginateHelper } from 'src/common/helper/paginate.helper';
import { CUSTOMER_CACHE_KEY, CUSTOMER_CACHE_TTL } from './customer.constant';
import { CustomerHelper } from './customer.helper';
import { CustomerPaginateRequest } from './dto/customer.input';
import {
  Customer,
  CustomerDocument,
  CustomerInterface,
} from './schema/customer.schema';

@Injectable()
export class CustomerGetter {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: PaginateModel<CustomerDocument>,

    @InjectModel(Customer.name)
    private customerSoftDeleteModel: SoftDeleteModel<CustomerDocument>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  customerCache = new AppCacheServiceManager(
    this.cacheManager,
    CUSTOMER_CACHE_KEY,
    CUSTOMER_CACHE_TTL,
  );
  // ****************************** QUERY DATA ********************************//

  async findAll(
    paginate: CustomerPaginateRequest,
    auth: any,
    otherQuery?: any,
  ): Promise<CustomerInterface> {
    const query = CustomerHelper.getFilterCustomerQuery({
      paginateInput: paginate,
      previous: {},
    });
    if (otherQuery) {
      Object.assign(query, otherQuery);
    }
    if (paginate.branches) {
      Object.assign(query, {
        branchId: { $in: paginate.branches },
      });
    }
    const res = await this.customerModel.paginate(query, paginate);
    return await PaginateHelper.getPaginationResult(res);
  }

  async findOne(condition: any): Promise<Customer> {
    return await this.customerModel.findOne(condition);
  }

  async findById(id: string): Promise<Customer> {
    return await this.customerModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Customer[] | undefined> {
    return this.customerModel.find({ _id: { $in: ids } }).exec();
  }

  async getAllByCondition(
    paginateInput: CustomerPaginateRequest,
    auth: any,
    otherQuery?: any,
  ): Promise<Customer[]> {
    const query = CustomerHelper.getFilterCustomerQuery({
      paginateInput,
      previous: {},
    });
    if (otherQuery) {
      Object.assign(query, otherQuery);
    }
    return await this.customerModel.find({});
  }
}
