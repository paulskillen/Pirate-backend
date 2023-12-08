import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { AdminAuthorizationGuard } from '../guard/authorization.guard';
import { GqlAuthGuard } from '../guard/gql-auth.guard';

export const ADMIN_AUTHORIZATION_KEY = 'ADMIN_AUTHORIZATION_KEY';
export const AdminAuthorization = (...permissions: any[]) => {
    return applyDecorators(
        SetMetadata(ADMIN_AUTHORIZATION_KEY, permissions),
        UseGuards(GqlAuthGuard),
        UseGuards(AdminAuthorizationGuard),
    );
};
