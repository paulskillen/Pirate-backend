import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './customer-auth.constant';
import { CustomerAuthService } from './customer-auth.service';
import { PassportModule } from '@nestjs/passport';
import { CustomerAuthResolver } from './customer-auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomerModule } from 'src/modules/customer/customer.module';

@Module({
    imports: [
        CacheModule.register(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JWT_SECRET,
            // signOptions: { expiresIn: "1d" },
        }),
        CustomerModule,
    ],
    providers: [CustomerAuthService, JwtStrategy, CustomerAuthResolver],
    exports: [CustomerAuthService],
})
export class CustomerAuthModule {}
