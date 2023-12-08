import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Cache } from 'cache-manager';
import { PaginateModel } from 'mongoose';
import { MediaFolderService } from '../media-folder/media-folder.service';
import {
    MediaFileCreateRequest,
    MediaFilePaginateRequest,
    MediaFileUpdateRequest,
} from './dto/media-file.dto';
import {
    MEDIA_FILE_CACHE_KEY,
    MEDIA_FILE_CACHE_TTL,
} from './media-file.constant';
import { EVENT_MEDIA_FILE } from './media-file.event';
import { MediaFileHelper } from './media-file.helper';
import {
    MediaFile,
    MediaFileDocument,
    MediaFileInterface,
} from './schema/media-file.schema';
import { PaginateHelper } from 'src/common/helper/paginate.helper';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';

@Injectable()
export class MediaFileService {
    constructor(
        @InjectModel(MediaFile.name)
        private readonly mediaFileModel: PaginateModel<MediaFileDocument>,

        @InjectModel(MediaFile.name)
        private mediaFileSoftDeleteModel: SoftDeleteModel<MediaFileDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

        private readonly eventEmitter: EventEmitter2,
        private readonly mediaFolderService: MediaFolderService,
    ) {}

    mediaFileCache = new AppCacheServiceManager(
        this.cacheManager,
        MEDIA_FILE_CACHE_KEY,
        MEDIA_FILE_CACHE_TTL,
    );

    // ****************************** UTIL METHOD ********************************//

    async countFilesByFolderId(folderId: string): Promise<number> {
        return await this.mediaFileModel
            .find({ folderId, $or: [{ deleted: null }, { deleted: false }] })
            .count();
    }

    // ****************************** QUERY DATA ********************************//

    async findAll(
        paginate: MediaFilePaginateRequest,
        auth: any,
        otherQuery?: any,
    ): Promise<MediaFileInterface> {
        const query = MediaFileHelper.getFilterMediaFileQuery({
            paginateInput: paginate,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        const res = await this.mediaFileModel.paginate(paginate);
        return await PaginateHelper.getPaginationResult(res);
    }

    async findOne(condition: any): Promise<MediaFile> {
        return await this.mediaFileModel.findOne(condition);
    }

    async findById(id: string): Promise<MediaFile> {
        return await this.mediaFileModel.findById(id);
    }

    async findByIds(ids: string[]): Promise<MediaFile[] | undefined> {
        return this.mediaFileModel.find({ _id: { $in: ids } }).exec();
    }

    async getAllByCondition(
        paginateInput: MediaFilePaginateRequest,
        auth: any,
        otherQuery?: any,
    ): Promise<MediaFile[]> {
        const query = MediaFileHelper.getFilterMediaFileQuery({
            paginateInput,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        return await this.mediaFileModel.find(query).exec();
    }

    // ****************************** MUTATE DATA ********************************//

    async create(
        input: MediaFileCreateRequest,
        admin: any,
    ): Promise<MediaFile> {
        const saveData: Partial<MediaFile> = { ...input };
        if (admin) {
            saveData.createByAdmin = admin?._id;
        }
        saveData.title = input.fileName;
        const mediaFile: MediaFile = await this.mediaFileModel.create(saveData);
        this.eventEmitter.emit(EVENT_MEDIA_FILE.CREATE, {
            payload: input,
            auth: admin,
            data: mediaFile,
        });
        return mediaFile;
    }

    async update(
        id: string,
        input: MediaFileUpdateRequest,
        admin: any,
    ): Promise<MediaFile> {
        const mediaFile: MediaFile = await this.mediaFileModel
            .findByIdAndUpdate(id, input, { new: true })
            .exec();

        this.eventEmitter.emit(EVENT_MEDIA_FILE.UPDATE, {
            payload: input,
            auth: admin,
            data: mediaFile,
        });

        await this.cacheManager.reset();

        return mediaFile;
    }

    async move(
        fileId: string,
        destinationId: string,
        admin: any,
    ): Promise<MediaFile> {
        const mediaFile: MediaFile = await this.mediaFileModel
            .findByIdAndUpdate(
                fileId,
                { $set: { folderId: destinationId } },
                { new: true },
            )
            .exec();
        this.eventEmitter.emit(EVENT_MEDIA_FILE.MOVE, {
            payload: { fileId, destinationId },
            auth: admin,
            data: mediaFile,
        });

        return mediaFile;
    }

    async moveMany(
        fileIds: string[],
        destinationId: string,
        admin: any,
    ): Promise<any> {
        const mediaFiles = await this.mediaFileModel
            .updateMany(
                { _id: { $in: fileIds } },
                { $set: { folderId: destinationId } },
                { new: true },
            )
            .exec();

        return mediaFiles;
    }

    async delete(id: string, admin: any): Promise<MediaFile | undefined> {
        const mediaFile = await this.mediaFileSoftDeleteModel.findById(id);
        mediaFile.deleteByAdmin = admin?._id;
        await mediaFile.remove();
        await this.cacheManager.reset();
        this.eventEmitter.emit(EVENT_MEDIA_FILE.REMOVE, {
            payload: { fileId: id },
            auth: admin,
            data: mediaFile,
        });
        return mediaFile;
    }

    async softDelete(id: string, admin: any): Promise<MediaFile | undefined> {
        const mediaFile = await this.mediaFileSoftDeleteModel.findByIdAndUpdate(
            id,
            { $set: { deleteByAdmin: admin?._id, deleted: true } },
            { new: true },
        );
        await this.cacheManager.reset();
        this.eventEmitter.emit(EVENT_MEDIA_FILE.REMOVE, {
            payload: { fileId: id },
            auth: admin,
            data: mediaFile,
        });
        return mediaFile;
    }

    async deleteMany(ids: string[], admin: any): Promise<any> {
        for (const id of ids) {
            const res = await this.softDelete(id, admin);
        }
        return true;
    }
}
