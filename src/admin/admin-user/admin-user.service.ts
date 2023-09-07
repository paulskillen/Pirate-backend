import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { map, some } from 'lodash';
import { PaginateModel } from 'mongoose';
import { AppHelper } from 'src/common/helper/app.helper';
import {
    IPaginationResult,
    PaginateHelper,
} from 'src/common/helper/paginate.helper';
import { PasswordHelper } from 'src/common/helper/password.helper';
import { WIUserProfile } from '../admin-auth/admin-auth.service';
import { ADMIN_BASIC_KEY, SpecialAccessType } from './admin-user.constant';
import { EVENT_ADMIN_USER } from './admin-user.event';
import { ADMIN_USERS_SEARCH_FIELDS } from './admin-user.helper';
import {
    AdminUser,
    AdminUserDocument,
    BaseAdminUser,
} from './schemas/admin-user.schema';
import { ListAdminUserInput } from './dto/admin-user.input';

@Injectable()
export class AdminUserService {
    private readonly logger = new Logger(AdminUserService.name);
    constructor(
        @InjectModel(AdminUser.name)
        private adminUserModel: PaginateModel<AdminUserDocument>,
        private eventEmitter: EventEmitter2,
    ) {}

    private hasUpdateBasicInfo(payload: any) {
        if (some(ADMIN_BASIC_KEY, (key) => !!payload?.[key])) {
            return true;
        }
        return false;
    }

    private async getNextAdminNo(): Promise<number> {
        const admin = await this.adminUserModel
            .findOne({}, {}, { sort: { _id: -1 } })
            .lean();
        if (admin?.adminNo) {
            return admin?.adminNo + 1;
        }
        return 1;
    }

    async getBasicAdminUser(
        user: string | AdminUser,
    ): Promise<BaseAdminUser | null> {
        const adminData =
            typeof user === 'string' ? await this.findOneById(user) : user;
        const {
            _id,
            adminNo,
            nickName,
            username,
            firstName,
            lastName,
            companyId,
            email,
        } = adminData || {};
        return {
            _id,
            adminNo,
            nickName,
            username,
            firstName,
            lastName,
            companyId,
            email,
        };
    }

    async getBasicAdminUserList(
        userIds: string[],
    ): Promise<Array<BaseAdminUser> | null> {
        const users = await this.findByIds(userIds);
        const bookingPics: Array<BaseAdminUser> = await Promise.all(
            map(users, async (user) => {
                return await this.getBasicAdminUser(user);
            }),
        );
        return bookingPics;
    }

    async getAllUsersOfBranch(
        branch: string,
    ): Promise<Array<AdminUser> | null> {
        return await this.adminUserModel.find({ branch });
    }

    private async hashPasswordInPayload(payload: any): Promise<any> {
        const password = payload?.password;
        if (password) {
            return {
                ...payload,
                password: await PasswordHelper.hash(password),
            };
        }
        return { ...payload };
    }

    async findOneById(id: string): Promise<AdminUserDocument | undefined> {
        return this.adminUserModel.findById(id).exec();
    }

    async findByIds(ids: string[]): Promise<AdminUserDocument[] | undefined> {
        return this.adminUserModel.find({ _id: { $in: ids } }).exec();
    }

    async findByCompanyId(
        companyId: string,
    ): Promise<AdminUserDocument | undefined> {
        return this.adminUserModel.findOne({ companyId }).exec();
    }

    async findOneByUsername(
        username: string,
    ): Promise<AdminUserDocument | undefined> {
        return this.adminUserModel.findOne({ username }).exec();
    }

    async findOneBySpecialAccess(
        code: string,
    ): Promise<AdminUserDocument | undefined> {
        const admin = await this.adminUserModel.findOne({
            'specialAccess.code': code,
            'specialAccess.status': true,
            'specialAccess.expired': { $gte: new Date() },
        });
        if (
            admin?.specialAccess?.specialAccessType ==
            SpecialAccessType.ONE_TIME_USE
        ) {
            await this.disableSpecialAccess(admin._id);
        }
        return admin;
    }

    async disableSpecialAccess(id: string): Promise<boolean> {
        await this.adminUserModel.updateOne(
            { id },
            { $set: { 'specialAccess.status': false } },
        );
        return true;
    }

    async getAdminUserLoginById(
        id: string,
    ): Promise<AdminUserDocument | undefined> {
        return this.adminUserModel.findOne({ _id: id, status: true }).lean();
    }

    async getAllByCondition(condition?: any): Promise<AdminUserDocument[]> {
        const query = {};
        if (condition) {
            Object.assign(query, condition);
        }
        return await this.adminUserModel.find(query);
    }

    async findAll(
        paginate: ListAdminUserInput,
        otherQuery?: any,
        admin?: any,
    ): Promise<IPaginationResult> {
        const search = AppHelper.generateSearchQuery(
            paginate,
            ADMIN_USERS_SEARCH_FIELDS,
            {},
        );
        const query = { $or: [] };
        if (search && search?.$or?.length > 0) {
            search?.$or.forEach((iQuery) => query.$or.push(iQuery));
        }
        if (!(query?.$or?.length > 0)) {
            delete query.$or;
        }
        const users = await this.adminUserModel.paginate(
            { ...query, ...(otherQuery || {}) },
            { ...PaginateHelper.getPaginationRequest(paginate) },
        );
        return await PaginateHelper.getPaginationResult(users);
    }

    async detail(id: string): Promise<AdminUserDocument | undefined> {
        return this.findOneById(id);
    }

    async create(
        payload: any,
        auth: any,
    ): Promise<AdminUserDocument | undefined> {
        const hashPasswordPayload = await this.hashPasswordInPayload(payload);
        const res = await new this.adminUserModel({
            ...hashPasswordPayload,
            adminNo: await this.getNextAdminNo(),
        }).save();
        this.eventEmitter.emit(EVENT_ADMIN_USER.CREATE, {
            payload: hashPasswordPayload,
            auth,
            data: res,
        });
        return res;
    }

    async update(
        id: string,
        payload: any,
        auth: any,
    ): Promise<AdminUserDocument | undefined> {
        const hashPasswordPayload = await this.hashPasswordInPayload(payload);
        const res = await this.adminUserModel.findByIdAndUpdate(
            id,
            { ...hashPasswordPayload },
            { new: true, upsert: false },
        );
        if (!res) {
            return undefined;
        }
        this.eventEmitter.emit(EVENT_ADMIN_USER.UPDATE, {
            payload: hashPasswordPayload,
            auth,
            data: res,
        });
        if (this.hasUpdateBasicInfo(payload)) {
            // this.eventEmitter.emit(EVENT_ADMIN_USER.UPDATE_ADMIN_USER_BASIC, {
            //     payload: hashPasswordPayload,
            //     auth,
            //     data: res,
            // });
        }
        return res;
    }

    async updateUserFromWI(
        payload: WIUserProfile,
        auth?: any,
    ): Promise<AdminUserDocument | undefined> {
        const { employee_id, avatar, firstName, lastName, nickname } = payload;
        const oldData = await this.adminUserModel.findOne({
            companyId: employee_id,
        });
        if (!oldData) {
            return undefined;
        }
        const {
            firstName: oldFn,
            lastName: oldLn,
            nickName: oldNn,
        } = oldData || {};
        const res = await this.adminUserModel.findOneAndUpdate(
            { companyId: employee_id },
            { $set: { avatar, firstName, lastName, nickName: nickname } },
            { new: true, upsert: false },
        );
        if (!res) {
            return undefined;
        }
        this.logger.log('Get user information from Work Infinity X');
        if (oldFn !== firstName || oldLn !== lastName || oldNn !== nickname) {
            this.logger.log(
                'Update user basic information from Work Infinity X',
                {
                    oldFn,
                    oldLn,
                    oldNn,
                    firstName,
                    lastName,
                    nickname,
                },
            );
            // this.eventEmitter.emit(EVENT_ADMIN_USER.UPDATE_ADMIN_USER_BASIC, {
            //     payload,
            //     auth,
            //     data: res,
            // });
        }
        return res;
    }

    async addBranchToUsers(
        branch: string,
        users: string[],
        auth: any,
    ): Promise<boolean | undefined> {
        const res = await this.adminUserModel.updateMany(
            { _id: { $in: users } },
            { $addToSet: { branch } },
            { new: true, upsert: false },
        );
        if (!res) {
            return undefined;
        }
        this.eventEmitter.emit(EVENT_ADMIN_USER.UPDATE, {
            payload: { branch, users },
            auth,
            data: res,
        });
        return true;
    }
}
