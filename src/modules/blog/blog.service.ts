import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
    BlogCreateRequest,
    BlogPaginateRequest,
    BlogUpdateRequest,
} from './dto/blog.input';
import { BlogDocument, Blog, BlogInterface } from './schema/blog.schema';
import { BlogHelper } from './blog.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_BLOG } from './blog.event';
import {
    BLOG_CACHE_KEY,
    BLOG_CACHE_TTL,
    BLOG_PREFIX_CODE,
} from './blog.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import { PaginateHelper } from 'src/common/helper/paginate.helper';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private templateModel: PaginateModel<BlogDocument>,

        @InjectModel(Blog.name)
        private templateSoftDeleteModel: SoftDeleteModel<BlogDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
    ) {}

    templateCache = new AppCacheServiceManager(
        this.cacheManager,
        BLOG_CACHE_KEY,
        BLOG_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        const latestData = await this.templateModel
            .findOne(
                {
                    blogNo: {
                        $regex: BLOG_PREFIX_CODE,
                    },
                },
                {},
                { sort: { _id: -1 } },
            )
            .limit(1)
            .lean();
        const dateTime = moment().format('YYMMDD');
        const latestNo =
            latestData?.blogNo ?? `${BLOG_PREFIX_CODE}${dateTime}00000`;
        const newId = AppHelper.generateIdWithCode(
            latestNo,
            BLOG_PREFIX_CODE,
            dateTime,
        );
        return newId;
    }

    // ****************************** QUERY DATA ********************************//

    async findAll(
        paginate: BlogPaginateRequest,
        auth: any,
        otherQuery?: any,
    ): Promise<BlogInterface> {
        const query = BlogHelper.getFilterTemplateQuery({
            paginateInput: paginate,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        const res = await this.templateModel.paginate(query, paginate);
        return await PaginateHelper.getPaginationResult(res);
    }

    async findOne(condition: any): Promise<Blog> {
        return await this.templateModel.findOne(condition);
    }

    async findById(id: string): Promise<Blog> {
        return await this.templateModel.findById(id).exec();
    }

    async findByIds(ids: string[]): Promise<Blog[] | undefined> {
        return this.templateModel.find({ _id: { $in: ids } }).exec();
    }

    async getAllByCondition(
        paginateInput: BlogPaginateRequest,
        auth: any,
        otherQuery?: any,
    ): Promise<Blog[]> {
        const query = BlogHelper.getFilterTemplateQuery({
            paginateInput,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        return await this.templateModel.find(query);
    }

    // ****************************** MUTATE DATA ********************************//

    async create(input: BlogCreateRequest, auth: any): Promise<Blog> {
        const saveData: Partial<Blog> = {
            ...input,
        } as unknown as Blog;
        const nextNo = await this.getNextNo();
        Object.assign(saveData, { templateNo: nextNo });
        if (auth?._id) {
            Object.assign(saveData, { createdByAdmin: auth._id });
        }
        try {
            const created = await this.templateModel.create(saveData);
            if (created) {
                this.eventEmitter.emit(EVENT_BLOG.CREATE, {
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
        input: BlogUpdateRequest,
        auth: any,
    ): Promise<Blog> {
        try {
            const updated = await this.templateModel.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $set: { ...input } },
                { new: true },
            );
            if (updated) {
                this.eventEmitter.emit(EVENT_BLOG.UPDATE, {
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
