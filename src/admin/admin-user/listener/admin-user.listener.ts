import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EVENT_ADMIN_AUTH } from 'src/admin/admin-auth/admin-auth.event';
import { AdminAuth } from 'src/admin/admin-auth/schemas/admin-auth.schema';
import { AdminUserService } from '../admin-user.service';

@Injectable()
export class AdminUserListener {
    constructor(
        private eventEmitter: EventEmitter2,
        private readonly adminUserService: AdminUserService,
    ) {}

    @OnEvent(EVENT_ADMIN_AUTH.CREATE, { async: true })
    async listenerAdminAuthCreateEvent(payload: {
        auth: any;
        data: AdminAuth;
        input?: any;
    }): Promise<boolean> {
        const { data } = payload || {};
        if (data?.adminId) {
            await this.adminUserService.updateLastLogin(data?.adminId);
        }
        return true;
    }

    @OnEvent(EVENT_ADMIN_AUTH.NEW_QUERY, { async: true })
    async listenerAdminAuthNewQueryEvent(payload: {
        data: AdminAuth;
    }): Promise<boolean> {
        const { adminId } = payload?.data || {};
        if (adminId) {
            await this.adminUserService.updateLastActive(adminId);
        }
        return true;
    }
}
