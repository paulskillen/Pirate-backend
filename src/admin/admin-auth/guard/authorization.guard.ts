import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_AUTHORIZATION_KEY } from '../decorator/authorization.decorator';
import { AdminRoleService } from 'src/admin/admin-role/admin-role.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private adminRoleService: AdminRoleService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authorization = this.reflector.getAllAndOverride<string[]>(
            ADMIN_AUTHORIZATION_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!authorization) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const user = request?.user;
        if (!user) {
            return false;
        }
        const roleId = user?.role;
        const role = await this.adminRoleService.getPermissionsByRoleId(roleId);
        const { isAdmin, permissions } = role;
        return (
            isAdmin == true ||
            authorization.some((permission) =>
                permissions?.includes(permission),
            )
        );
    }
}
