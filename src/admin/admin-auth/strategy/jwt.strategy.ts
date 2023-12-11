import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from '../admin-auth.service';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ADMIN_AUTH } from '../admin-auth.event';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'adminStrategy') {
    constructor(
        private adminAuthService: AdminAuthService,
        private adminUserService: AdminUserService,
        private i18nService: I18nService,
        private eventEmitter: EventEmitter2,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const { sub: tokenId, adminId } = payload;
        const [token, admin] = await Promise.all([
            this.adminAuthService.getTokenValidById(tokenId),
            this.adminUserService.getAdminUserLoginById(adminId),
        ]);
        if (!token) {
            throw new UnauthorizedException(
                await this.i18nService.t('admin.auth.token.invalid'),
            );
        }
        if (!admin) {
            throw new UnauthorizedException(
                await this.i18nService.t('admin.auth.account.invalid'),
            );
        }
        this.eventEmitter.emit(EVENT_ADMIN_AUTH.NEW_QUERY, {
            data: token?.toObject?.(),
        });
        return { ...admin, authType: 'Admin' };
    }
}
