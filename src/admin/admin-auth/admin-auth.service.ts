import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { PaginateModel } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { PasswordHelper } from 'src/common/helper/password.helper';
import { AdminRoleService } from '../admin-role/admin-role.service';
import { AdminUserService } from '../admin-user/admin-user.service';
import { AdminUser } from '../admin-user/schemas/admin-user.schema';
import { ADMIN_AUTH_EXPIRED_AFTER_HOURS, Device } from './admin-auth.constant';
import { ILoginResponse } from './interfaces/login.interface';
import { AdminAuth, AdminAuthDocument } from './schemas/admin-auth.schema';
import { EVENT_ADMIN_AUTH } from './admin-auth.event';

export interface WIUserProfile {
    id?: string;
    employee_id?: string;
    avatar?: string;
    nickname?: string;
    firstName?: string;
    lastName?: string;
}

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectModel(AdminAuth.name)
        private adminAuthModel: PaginateModel<AdminAuthDocument>,
        private eventEmitter: EventEmitter2,
        private adminUserService: AdminUserService,
        private adminRoleService: AdminRoleService,
        private jwtService: JwtService,
        private i18nService: I18nService,
    ) {}

    private getNextTimeExpiresTokenId(): Date {
        const now = new Date();
        now.setHours(now.getHours() + ADMIN_AUTH_EXPIRED_AFTER_HOURS);
        return now;
    }

    async getTokenValidById(
        tokenId: string,
    ): Promise<AdminAuthDocument | undefined> {
        return this.adminAuthModel.findOne({
            _id: tokenId,
            expiresIn: { $gte: new Date() },
        });
    }

    private async getAccessToken(admin: AdminUser, device: Device) {
        const [token, role] = await Promise.all([
            this.createTokenIdAuthAdmin({ adminId: admin?._id, device }),
            this.adminRoleService.getPermissionsByRoleId(admin?.role),
        ]);
        const profile = {
            id: admin?._id,
            companyId: admin?.companyId,
            nickName: admin?.nickName,
            avatar: admin?.avatar,
            firstName: admin?.firstName,
            lastName: admin?.lastName,
            email: admin?.email,
        };
        return {
            accessToken: this.jwtService.sign({
                sub: token,
                adminId: admin?._id,
                role,
                profile,
            }),
        };
    }

    async validateAdminUserLoginBySpecialAccess(
        password: string,
    ): Promise<any> {
        const admin = await this.adminUserService.findOneBySpecialAccess(
            password,
        );
        if (admin) {
            return admin;
        }
        return null;
    }

    async validateAdminUserLogin(
        username: string,
        password: string,
    ): Promise<any> {
        const admin = await this.adminUserService.findOneByUsername(username);
        if (!admin) {
            return null;
        }
        const hasPasswordIsValid = await PasswordHelper.validate(
            password,
            admin?.password,
        );
        if (!hasPasswordIsValid) {
            return null;
        }
        return admin;
    }

    private async createTokenIdAuthAdmin(payload: {
        adminId: string;
        device: Device;
    }): Promise<string> {
        const res = await this.adminAuthModel.create({
            adminId: payload.adminId,
            device: payload.device,
            expiresIn: this.getNextTimeExpiresTokenId(),
        });
        this.eventEmitter.emit(EVENT_ADMIN_AUTH.CREATE, {
            payload: res,
        });
        return res._id;
    }

    async login(payload: {
        adminId: string;
        device: Device;
    }): Promise<ILoginResponse | null> {
        const { adminId, device } = payload;
        const admin = await this.adminUserService.findOneById(adminId);
        if (!admin) {
            return { accessToken: null };
        }
        return await this.getAccessToken(admin, device);
    }

    async loginByCompanyId(
        companyId: string,
        device: Device,
    ): Promise<any | null> {
        try {
            const user: AdminUser = await this.adminUserService.findByCompanyId(
                companyId,
            );
            if (!user) {
                throw new AuthenticationError(
                    `The company id ${companyId} not match with any users`,
                );
            }
            if (user.status == false) {
                throw new UnauthorizedException(
                    await this.i18nService.t('admin.auth.account.blocked'),
                );
            }
            return await this.getAccessToken(user, device);
        } catch (error) {
            throw error;
        }
    }
}
