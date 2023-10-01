import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminRole, AdminRoleDocument } from './schemas/admin-role.schema';
import { PaginateModel } from 'mongoose';
import { ListAdminRoleInput } from './dto/admin-role.dto';
import {
    IPaginationResult,
    PaginateHelper,
} from 'src/common/helper/paginate.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ADMIN_ROLE } from './admin-role.event';

@Injectable()
export class AdminRoleService {
    constructor(
        @InjectModel(AdminRole.name)
        private adminRoleModel: PaginateModel<AdminRoleDocument>,
        private eventEmitter: EventEmitter2,
    ) {}

    private async getNextRoleNo(): Promise<number> {
        const role = await this.adminRoleModel
            .findOne({}, {}, { sort: { _id: -1 } })
            .lean();
        if (role?.roleNo) {
            return role?.roleNo + 1;
        }
        return 1;
    }

    async all(): Promise<AdminRoleDocument[]> {
        return this.adminRoleModel.find({}).sort({ name: 1 });
    }

    async findAll(paginate: ListAdminRoleInput): Promise<IPaginationResult> {
        const search = PaginateHelper.getSearchRequest(paginate);
        const roles = await this.adminRoleModel.paginate(
            { ...search },
            { ...PaginateHelper.getPaginationRequest(paginate) },
        );
        return await PaginateHelper.getPaginationResult(roles);
    }

    async detail(id: string): Promise<AdminRoleDocument | undefined> {
        return this.adminRoleModel.findById(id);
    }

    async create(
        payload: any,
        auth: any,
    ): Promise<AdminRoleDocument | undefined> {
        const res = await new this.adminRoleModel({
            ...payload,
            roleNo: await this.getNextRoleNo(),
        }).save();
        this.eventEmitter.emit(EVENT_ADMIN_ROLE.CREATE, {
            payload,
            auth,
            data: res,
        });
        return res;
    }

    async update(
        id: string,
        payload: any,
        auth: any,
    ): Promise<AdminRoleDocument | undefined> {
        const res = await this.adminRoleModel.findByIdAndUpdate(
            id,
            { ...payload },
            { new: true, upsert: false },
        );
        if (!res) {
            return undefined;
        }
        this.eventEmitter.emit(EVENT_ADMIN_ROLE.UPDATE, {
            payload,
            auth,
            data: res,
        });
        return res;
    }

    async getPermissionsByRoleId(
        id: string,
    ): Promise<{ permissions: string[]; isAdmin: boolean }> {
        const role = await this.adminRoleModel.findById(id);
        if (!role) {
            return { permissions: [], isAdmin: false };
        }
        return {
            permissions: role?.permissions,
            isAdmin: role?.isAdmin,
        };
    }
}
