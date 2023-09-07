import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { GenerateSecretResponse } from './dto/admin-authenticator.dto';
import { AdminAuthenticatorService } from './admin-authenticator.service';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { PERMISSION } from 'src/common/constant/permission.constant';

@Resolver()
export class AdminAuthenticatorResolver {
    constructor(
        private readonly adminAuthenticatorService: AdminAuthenticatorService,
    ) {}

    @AdminAuthorization(PERMISSION.COMMON)
    @Mutation(() => GenerateSecretResponse)
    async generateAuthenticatorSecret(): Promise<any> {
        return { secret: this.adminAuthenticatorService.generateSecret() };
    }
}
