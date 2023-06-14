import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { isEmpty, map } from 'lodash';
import * as moment from 'moment';
import { PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    ErrorInternalException,
    ErrorNotFound,
} from 'src/common/errors/errors.constant';
import {
    CUSTOMER_PREFIX_CODE,
    CUSTOMER_CACHE_KEY,
    CUSTOMER_CACHE_TTL,
} from './customer.constant';
import { EVENT_CUSTOMER } from './customer.event';
import { CustomerGetter } from './customer.getter';
import { CustomerCreateInput } from './dto/customer.input';
import {
    BaseCustomer,
    Customer,
    CustomerDocument,
} from './schema/customer.schema';
import { AppHelper } from 'src/common/helper/app.helper';
import { PasswordHelper } from 'src/common/helper/password.helper';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name)
        private customerModel: PaginateModel<CustomerDocument>,

        @InjectModel(Customer.name)
        private customerSoftDeleteModel: SoftDeleteModel<CustomerDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,

        @Inject(forwardRef(() => CustomerGetter))
        private customerGetter: CustomerGetter,
    ) {}

    customerCache = new AppCacheServiceManager(
        this.cacheManager,
        CUSTOMER_CACHE_KEY,
        CUSTOMER_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        const lastData = await this.customerModel
            .findOne(
                {
                    bookingNo: { $regex: CUSTOMER_PREFIX_CODE },
                },
                {},
                { sort: { _id: -1 } },
            )
            .limit(1)
            .lean();
        const dateTime = moment().format('YYMMDD');
        const lastDataNo =
            lastData?.customerNo ?? `${CUSTOMER_PREFIX_CODE}${dateTime}00000`;
        const newId = AppHelper.generateIdWithCode(
            lastDataNo,
            CUSTOMER_PREFIX_CODE,
            dateTime,
        );
        return newId;
    }

    async getBasicCustomer(
        user: string | Customer,
    ): Promise<BaseCustomer | null> {
        const customerData =
            typeof user === 'string' ? await this.findById(user) : user;
        const {
            _id,
            customerNo,
            title,
            firstName,
            lastName,
            nickname,
            gender,
            birthDay,
            phoneCode,
            phone,
            email,
        } = customerData || {};
        return {
            _id,
            id: _id?.toString?.(),
            customerNo,
            title,
            firstName,
            lastName,
            nickname,
            gender,
            birthDay,
            phoneCode,
            phone,
            email,
        };
    }

    // ****************************** QUERY DATA ********************************//

    async findByIds(ids: string[]): Promise<Customer[] | undefined> {
        return this.customerModel.find({ _id: { $in: ids } }).exec();
    }

    async findById(id: string): Promise<Customer | undefined> {
        return this.customerModel.findOne({ _id: id }).exec();
    }

    async login(username: string): Promise<Customer> {
        return this.customerModel
            .findOneAndUpdate(
                { $or: [{ email: username }] },
                { $set: { lastLogin: new Date() } },
                { new: true },
            )
            .exec();
    }

    async socialLogin(socialId: string): Promise<Customer> {
        if (!socialId) {
            throw ErrorInternalException('[socialId]: can not be null');
        }
        return this.customerModel
            .findOneAndUpdate(
                { socialId },
                { $set: { lastLogin: new Date() } },
                { new: true },
            )
            .exec();
    }

    // ****************************** MUTATE DATA ********************************//

    async create(input: CustomerCreateInput, auth?: any): Promise<Customer> {
        const customerNo = await this.getNextNo();
        if (!customerNo) {
            throw ErrorInternalException(
                'Something went wrong! Can not create Customer No !',
            );
        }
        const foundUser = await this.customerModel.find({
            email: input?.email,
        });
        if (!isEmpty(foundUser)) {
            throw ErrorNotFound(
                'Email address is already registered, please login instead !',
            );
        }
        const saveData: Partial<Customer> = {
            ...input,
            customerNo,
            password: input.password
                ? await PasswordHelper.hash(input.password)
                : undefined,
        } as unknown as Customer;
        // if (auth?._id) {
        //   Object.assign(saveData, { createByAdmin: auth._id });
        // }
        const created = await this.customerModel.create(saveData);
        if (created) {
            this.eventEmitter.emit(EVENT_CUSTOMER.CREATE, {
                payload: input,
                auth,
                data: created,
            });
            await this.customerCache.set(created);

            //   this.customerActivity.addOperation({
            //     message: `created new customer #${created?.customerId}`,
            //     auth,
            //     input,
            //     updatedData: created,
            //   });
        }
        return created;
    }

    async updateAvatar(
        id: string,
        avatar: string,
        auth: any,
    ): Promise<Customer> {
        const updated = await this.customerModel.findByIdAndUpdate(
            { _id: id },
            { $set: { $set: { avatar } } },
            { new: true, upsert: false },
        );
        if (updated) {
            this.eventEmitter.emit(EVENT_CUSTOMER.UPDATE_AVATAR, {
                payload: { avatar },
                auth,
                data: updated,
            });
            await this.customerCache.set(updated);

            //   this.customerActivity.addOperation({
            //     message: `updated avatar of customer #${updated?.customerId}`,
            //     auth,
            //     input: { avatar },
            //     updatedData: updated,
            //   });
        }

        return updated;
    }
}
