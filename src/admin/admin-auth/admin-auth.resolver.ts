import { UnauthorizedException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AdminLoginRequest, AdminLoginResponse } from './dto/admin-auth.dto';
import { AdminAuthService } from './admin-auth.service';
import { I18nService } from 'nestjs-i18n';
import { AdminAuthenticatorService } from '../admin-authenticator/admin-authenticator.service';
import { Device } from './admin-auth.constant';

@Resolver()
export class AdminAuthResolver {
    constructor(
        private readonly adminAuthService: AdminAuthService,
        private i18nService: I18nService,
        private adminAuthenticatorService: AdminAuthenticatorService,
    ) {}

    async loginByUser(admin: any, device: Device): Promise<any> {
        if (admin) {
            const { accessToken } = await this.adminAuthService.login({
                adminId: admin._id,
                device,
            });
            return {
                accessToken,
                verified: true,
                authenticated: true,
            };
        }
        return {
            accessToken: null,
            verified: false,
            authenticated: false,
        };
    }

    @Query(() => AdminLoginResponse)
    async loginAdmin(
        @Args('request') request: AdminLoginRequest,
        @Args('device') device: Device,
    ): Promise<any> {
        const { username, password, authenticator } = request;
        const loginBySpecialAccess =
            await this.adminAuthService.validateAdminUserLoginBySpecialAccess(
                password,
            );
        if (loginBySpecialAccess) {
            return this.loginByUser(loginBySpecialAccess, device);
        }
        const admin = await this.adminAuthService.validateAdminUserLogin(
            username,
            password,
        );
        if (!admin) {
            throw new UnauthorizedException(
                await this.i18nService.t('admin.auth.user.invalid'),
            );
        }
        if (admin.status == false) {
            throw new UnauthorizedException(
                await this.i18nService.t('admin.auth.account.blocked'),
            );
        }
        if (admin?.authenticationStatus == true && admin?.authenticationCode) {
            const isAuthenticated =
                await this.adminAuthenticatorService.verifyToken(
                    authenticator,
                    admin?.authenticationCode,
                );
            if (isAuthenticated == false) {
                return this.loginByUser(null, device);
            }
        }
        return this.loginByUser(admin, device);
    }
}
