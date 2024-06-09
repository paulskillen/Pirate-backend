import { Module, forwardRef } from '@nestjs/common';
import { AdminAuthenticatorService } from './admin-authenticator.service';
import { AdminAuthenticatorResolver } from './admin-authenticator.resolver';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';

@Module({
    imports: [forwardRef(() => AdminAuthModule), AdminRoleModule],
    providers: [AdminAuthenticatorService, AdminAuthenticatorResolver],
    exports: [AdminAuthenticatorService],
})
export class AdminAuthenticatorModule {}
