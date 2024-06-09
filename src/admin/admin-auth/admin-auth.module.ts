import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAuth, AdminAuthSchema } from './schemas/admin-auth.schema';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthResolver } from './admin-auth.resolver';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { AdminRoleModule } from '../admin-role/admin-role.module';
import { AdminAuthenticatorModule } from '../admin-authenticator/admin-authenticator.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminAuthorizationGuard } from './guard/authorization.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AdminAuth.name, schema: AdminAuthSchema },
        ]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>('JWT_SECRET'),
                };
            },
            inject: [ConfigService],
        }),
        forwardRef(() => AdminUserModule),
        forwardRef(() => AdminRoleModule),
        forwardRef(() => AdminAuthenticatorModule),
    ],
    providers: [
        JwtStrategy,
        GqlAuthGuard,
        AdminAuthService,
        AdminAuthResolver,
        AdminAuthorizationGuard,
    ],
    controllers: [],
})
export class AdminAuthModule {}
