import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminRoleService } from './admin-role.service';
import { AdminRole, AdminRoleSchema } from './schemas/admin-role.schema';
import { AdminRoleResolver } from './admin-role.resolver';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AdminRole.name, schema: AdminRoleSchema },
        ]),
        forwardRef(() => AdminAuthModule),
    ],
    providers: [AdminRoleService, AdminRoleResolver],
    exports: [AdminRoleService],
})
export class AdminRoleModule {}
