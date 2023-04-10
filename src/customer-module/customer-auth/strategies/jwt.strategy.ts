import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from 'src/modules/customer/customer.service';
import { Customer } from 'src/modules/customer/schema/customer.schema';
import { JWT_SECRET } from '../customer-auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly customerService: CustomerService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(validationPayload) {
        const authCache: string = await this.cacheManager.get(
            `{customer}:${validationPayload.id}`,
        );

        let currentAuth: Customer;
        if (!authCache) {
            currentAuth = await this.customerService.findById(
                validationPayload.id,
            );

            await this.cacheManager.set(
                `{customer}:${validationPayload.id}`,
                JSON.stringify(currentAuth),
                {
                    ttl: 6000,
                },
            );
        } else {
            currentAuth = JSON.parse(authCache);
        }

        return currentAuth;
    }
}
