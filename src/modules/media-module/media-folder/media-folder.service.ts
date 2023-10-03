import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { filter, map, isEmpty } from 'lodash';
import { Model, Types } from 'mongoose';
import { MediaFolderStatus } from './media-folder.constant';
import { MediaFolder, MediaFolderDocument } from './schema/media-folder.schema';
import {
    MediaFolderCreateInput,
    MediaFolderPaginateInput,
    MediaFolderUpdateInput,
} from './dto/media-folder.dto';
import { AppHelper } from 'src/common/helper/app.helper';

@Injectable()
export class MediaFolderService {
    constructor(
        @InjectModel(MediaFolder.name)
        private readonly folderModel: Model<MediaFolderDocument>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    mapListToTreeData = (items, id = null, link = 'parentId') =>
        items
            .filter((item) => item[link] === id)
            .map((item) => ({
                ...item,
                children: this.mapListToTreeData(items, item.id),
            }));

    async findById(id: string): Promise<MediaFolder | undefined> {
        if (!Types.ObjectId.isValid(id)) return;
        return this.folderModel.findById(id).exec();
    }

    async findByIds(ids: string[]): Promise<MediaFolder[] | undefined> {
        return this.folderModel.find({ _id: { $in: ids } }).exec();
    }

    async getAll(
        paginate?: MediaFolderPaginateInput,
        auth?: any,
    ): Promise<MediaFolder[]> {
        const preQuery: any = {
            status: MediaFolderStatus.ACTIVE,
        };
        const query = AppHelper.generateSearchQuery(
            paginate,
            ['name'],
            preQuery,
        );
        return await this.folderModel.find(query).exec();
    }

    async getFolderTree(): Promise<any[]> {
        const allFolder = await this.folderModel.find().exec();
        if (isEmpty(allFolder)) {
            return [];
        }
        const transformData = map(allFolder, (item) => ({
            ...item,
            name: item.name,
            parentId: item.parentId ? item.parentId.toString() : null,
            id: (item as any)._id.toString(),
        }));
        const treeList = this.mapListToTreeData(transformData);
        return treeList;
    }

    async create(
        input: MediaFolderCreateInput,
        auth: any,
    ): Promise<MediaFolder[]> {
        Object.assign(input, { createByAdmin: auth?._id });
        await this.folderModel.create(input);
        return this.getAll();
    }

    async update(
        id: string,
        input: MediaFolderUpdateInput,
        admin: any,
    ): Promise<MediaFolder[]> {
        await this.folderModel
            .findByIdAndUpdate(id, { $set: input }, { new: true })
            .exec();
        return this.getAll();
    }

    async move(
        id: string,
        parentId: string,
        admin: any,
    ): Promise<MediaFolder[]> {
        await this.folderModel
            .findByIdAndUpdate(id, { $set: { parentId } }, { new: true })
            .exec();
        return this.getAll();
    }

    async delete(id: string, admin: any): Promise<MediaFolder[]> {
        await this.folderModel
            .findByIdAndUpdate(id, {
                $set: {
                    status: MediaFolderStatus.INACTIVE,
                    deleteByAdmin: admin?._id,
                },
            })
            .exec();
        return this.getAll();
    }

    async getAllFolderChildById(id: string, folders = []): Promise<string[]> {
        let res = folders.map((item) => {
            return item.toString();
        });
        const allFolder = await this.folderModel.find({
            parentId: id,
            status: MediaFolderStatus.ACTIVE,
        });
        for (const item of allFolder) {
            const id = item?.id?.toString();
            if (res.includes(id)) {
                continue;
            }
            res.push(id);
            res = await this.getAllFolderChildById(id, res);
        }
        return res;
    }
}
