import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from './schemas/admin-user.schema';
import { AdminUserResolver } from './admin-user.resolver';
import { AdminUserService } from './admin-user.service';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AdminUser.name, schema: AdminUserSchema },
        ]),
        forwardRef(() => AdminAuthModule),
        AdminRoleModule,
    ],
    providers: [AdminUserResolver, AdminUserService],
    exports: [AdminUserService],
})
export class AdminUserModule {}
