/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
    StaticCreateInput,
    StaticPaginateInput,
    StaticUpdateInput,
} from './dto/static.input';
import {
    StaticPageDocument,
    StaticPage,
    StaticPageInterface,
} from './schema/static.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_STATIC_PAGE } from './static.event';
import {
    STATIC_CACHE_KEY,
    STATIC_CACHE_TTL,
    STATIC_PREFIX_CODE,
    StaticPageTemplate,
} from './static.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import { PaginateHelper } from 'src/common/helper/paginate.helper';
import { ErrorNotFound } from 'src/common/errors/errors.constant';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import { AdminUser } from 'src/admin/admin-user/schemas/admin-user.schema';

@Injectable()
export class StaticService {
    constructor(
        @InjectModel(StaticPage.name)
        private staticModel: PaginateModel<StaticPageDocument>,

        @InjectModel(StaticPage.name)
        private staticSoftDeleteModel: SoftDeleteModel<StaticPageDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
    ) {}

    staticCache = new AppCacheServiceManager(
        this.cacheManager,
        STATIC_CACHE_KEY,
        STATIC_CACHE_TTL,
    );

    private readonly logger = new Logger(StaticService.name);

    // ****************************** UTIL METHOD ********************************//

    // ****************************** QUERY DATA ********************************//

    async findAll(
        paginate: StaticPaginateInput,
        auth?: any,
        otherQuery?: any,
    ): Promise<StaticPageInterface> {
        const res = await this.staticModel.paginate(otherQuery, paginate);
        return await PaginateHelper.getPaginationResult(res);
    }

    async findOne(condition: any, auth?: any): Promise<StaticPage> {
        return await this.staticModel.findOne(condition);
    }

    async findById(id: string, auth?: any): Promise<StaticPage> {
        return await this.staticModel.findById(id).exec();
    }

    async findByIds(
        ids: string[],
        auth?: any,
    ): Promise<StaticPage[] | undefined> {
        return this.staticModel.find({ _id: { $in: ids } }).exec();
    }

    async getAllByCondition(query: any, auth?: any): Promise<StaticPage[]> {
        return await this.staticModel.find(query);
    }

    // ****************************** MUTATE DATA ********************************//

    async create(input: StaticCreateInput, auth: any): Promise<StaticPage> {
        const saveData: Partial<StaticPage> = {
            ...input,
        } as unknown as StaticPage;
        if (auth?._id) {
            Object.assign(saveData, { createdByAdmin: auth._id });
        }
        try {
            const created = await this.staticModel.create(saveData);
            if (created) {
                this.eventEmitter.emit(EVENT_STATIC_PAGE.CREATE, {
                    payload: input,
                    auth,
                    data: created,
                });
                await this.staticCache.set(created);
                return created;
            } else throw ErrorNotFound();
        } catch (error) {
            this.logger.error(error);
            throw new Error(error);
        }
    }

    async update(
        id: string,
        input: StaticUpdateInput,
        auth: any,
    ): Promise<StaticPage> {
        try {
            const updated = await this.staticModel.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $set: { ...input } },
            );
            if (updated) {
                this.eventEmitter.emit(EVENT_STATIC_PAGE.UPDATE, {
                    payload: input,
                    auth,
                    data: updated,
                });
                await this.staticCache.set(updated);
                return updated;
            } else throw new Error();
        } catch (error) {
            this.logger.error(error);
            throw new Error(error);
        }
    }

    async updateByTemplate(
        template: StaticPageTemplate,
        input: StaticUpdateInput,
        auth: AdminUser,
    ): Promise<StaticPage> {
        try {
            const updated = await this.staticModel.findOneAndUpdate(
                { template },
                { $set: { ...input, updatedByAdmin: auth?._id } },
                { new: true, upsert: true },
            );
            if (updated) {
                this.eventEmitter.emit(EVENT_STATIC_PAGE.UPDATE, {
                    payload: input,
                    auth,
                    data: updated,
                });
                await this.staticCache.set(updated);
                return updated;
            } else throw new Error();
        } catch (error) {
            this.logger.error(error);
            throw new Error(error);
        }
    }
}
