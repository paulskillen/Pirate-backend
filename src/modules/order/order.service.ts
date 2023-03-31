/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
    OrderCreateInput,
    OrderPaginateInput,
    OrderUpdateInput,
} from './dto/order.input';
import { OrderDocument, Order, OrderInterface } from './schema/order.schema';
import { OrderHelper } from './order.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ORDER } from './order.event';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    ORDER_CACHE_KEY,
    ORDER_CACHE_TTL,
    ORDER_PREFIX_CODE,
} from './order.constant';
import { PaginateHelper } from 'src/common/helper/paginate.helper';
import { AppHelper } from 'src/common/helper/app.helper';

@Injectable()
export class TemplateService {
    constructor(
        @InjectModel(Order.name)
        private templateModel: PaginateModel<OrderDocument>,

        @InjectModel(Order.name)
        private templateSoftDeleteModel: SoftDeleteModel<OrderDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
    ) {}

    templateCache = new AppCacheServiceManager(
        this.cacheManager,
        ORDER_CACHE_KEY,
        ORDER_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        const latestData = await this.templateModel
            .findOne(
                {
                    templateNo: {
                        $regex: ORDER_PREFIX_CODE,
                    },
                },
                {},
                { sort: { _id: -1 } },
            )
            .limit(1)
            .lean();
        const dateTime = moment().format('YYMMDD');
        const latestNo =
            latestData?.orderNo ?? `${ORDER_PREFIX_CODE}${dateTime}00000`;
        const newId = AppHelper.generateNextDataNo(
            latestNo,
            ORDER_PREFIX_CODE,
            dateTime,
        );
        return newId;
    }

    // ****************************** QUERY DATA ********************************//

    async findAll(
        paginate: OrderPaginateInput,
        auth?: any,
        otherQuery?: any,
    ): Promise<OrderInterface> {
        const query = OrderHelper.getFilterOrderQuery({
            paginateInput: paginate,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        const res = await this.templateModel.paginate(query, paginate);
        return await PaginateHelper.getPaginationResult(res);
    }

    async findOne(condition: any, auth?: any): Promise<Order> {
        return await this.templateModel.findOne(condition);
    }

    async findById(id: string, auth?: any): Promise<Order> {
        return await this.templateModel.findById(id).exec();
    }

    async findByIds(ids: string[], auth?: any): Promise<Order[] | undefined> {
        return this.templateModel.find({ _id: { $in: ids } }).exec();
    }

    async getAllByCondition(
        paginateInput: OrderPaginateInput,
        auth?: any,
        otherQuery?: any,
    ): Promise<Order[]> {
        const query = OrderHelper.getFilterOrderQuery({
            paginateInput,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        return await this.templateModel.find(query);
    }

    // ****************************** MUTATE DATA ********************************//

    async create(input: OrderCreateInput, auth: any): Promise<Order> {
        const saveData: Partial<Order> = {
            ...input,
        } as unknown as Order;
        const genBranchNo = await this.getNextNo();
        Object.assign(saveData, { templateId: genBranchNo });
        if (auth?._id) {
            Object.assign(saveData, { createdByAdmin: auth._id });
        }
        try {
            const created = await this.templateModel.create(saveData);
            if (created) {
                this.eventEmitter.emit(EVENT_ORDER.CREATE, {
                    payload: input,
                    auth,
                    data: created,
                });
                await this.templateCache.set(created);
                return created;
            } else throw new Error();
        } catch (error) {
            throw new Error();
        }
    }

    async update(
        id: string,
        input: OrderUpdateInput,
        auth: any,
    ): Promise<Order> {
        try {
            const updated = await this.templateModel.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $set: { ...input } },
                { new: true },
            );
            if (updated) {
                this.eventEmitter.emit(EVENT_ORDER.UPDATE, {
                    payload: input,
                    auth,
                    data: updated,
                });
                await this.templateCache.set(updated);
                return updated;
            } else throw new Error();
        } catch (error) {
            throw new Error();
        }
    }
}
