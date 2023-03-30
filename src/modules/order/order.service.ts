/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
    OrderCreateInput,
    OrderPaginateInput,
    OrderUpdateInput,
} from './dto/order.input';
import {
    OrderDocument,
    Order,
    OrderInterface,
} from './schema/order.schema';
import { PaginateHelper } from 'src/common/helpers/paginate.helper';
import { OrderHelper } from './order.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ORDER } from './order.event';
import { CacheServiceManager } from 'src/cache/cache.service';
import { ORDER_CACHE_KEY, ORDER_CACHE_TTL } from './order.constant';

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

    templateCache = new CacheServiceManager(
        this.cacheManager,
        ORDER_CACHE_KEY,
        ORDER_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<number> {
        const template = await this.templateModel
            .findOne({}, {}, { sort: { _id: -1 } })
            .lean();
        if (template?.orderNo) {
            return template?.orderNo + 1;
        }
        return 1;
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

    async findByIds(
        ids: string[],
        auth?: any,
    ): Promise<Order[] | undefined> {
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
