import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
    CUSTOMER_CACHE_KEY,
    CUSTOMER_CACHE_TTL,
} from 'src/modules/customer/customer.constant';
import { CustomerService } from 'src/modules/customer/customer.service';
import { Customer } from 'src/modules/customer/schema/customer.schema';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
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

    customerCache = new AppCacheServiceManager(
        this.cacheManager,
        CUSTOMER_CACHE_KEY,
        CUSTOMER_CACHE_TTL,
    );

    async validate(validationPayload) {
        const authCache: string = await this.customerCache.get(
            validationPayload,
        );

        let currentAuth: Customer;
        if (!authCache) {
            currentAuth = await this.customerService.findById(
                validationPayload.id,
            );

            await this.customerCache.set(currentAuth);
        } else {
            currentAuth = JSON.parse(authCache);
        }

        return currentAuth;
    }
}
