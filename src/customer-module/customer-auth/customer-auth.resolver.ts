import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CustomerRegisterInput } from 'src/modules/customer/dto/customer.input';
import AppleAuth from 'src/modules/third-party/apple.auth';
import FacebookAuth from 'src/modules/third-party/facebook.auth';
import GoogleAuth from 'src/modules/third-party/google.auth';
import { SocialProvider } from './customer-auth.constant';
import { AuthService } from './customer-auth.service';
import {
    LoginResponseDto,
    LoginSocialResponseDto,
} from './dto/customer-auth.dto';

@Resolver()
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private customerService: CustomerService,
        private jwtService: JwtService,
    ) {}

    @Mutation()
    async login(@Args() args: any): Promise<LoginResponseDto> {
        try {
            const { username, password } = args;
            const loginResponse = await this.authService.login(
                username,
                password,
            );
            return loginResponse;
        } catch (error) {
            throw error;
        }
    }

    @Mutation()
    async register(
        @Args('input') input: CustomerRegisterInput,
    ): Promise<LoginResponseDto> {
        try {
            const registerRes = await this.authService.register(input);
            return { ...registerRes, otpToken: registerRes.token };
        } catch (error) {
            throw error;
        }
    }

    @Mutation()
    async loginSocial(
        @Args('provider') provider: SocialProvider,
        @Args('token') token: string,
    ): Promise<LoginSocialResponseDto> {
        let userProfile;
        try {
            switch (provider) {
                case SocialProvider.APPLE:
                    userProfile = await AppleAuth.userProfile(
                        token,
                        this.jwtService,
                    );
                    break;
                case SocialProvider.GOOGLE:
                    userProfile = await GoogleAuth.userProfile(token);
                    break;
                case SocialProvider.FACEBOOK:
                    userProfile = await FacebookAuth.userProfile(token);
                    break;
                default:
                    break;
            }
            const loginResponse = await this.authService.loginSocial(
                userProfile,
            );
            return loginResponse;
        } catch (error) {
            throw error;
        }
    }

    // @Mutation()
    // async resetPassword(
    //     @Args('input') input: ResetPasswordInput,
    // ): Promise<ResetPasswordResponse> {
    //     try {
    //         const authVerified = await this.jwtService.verify(input.token);
    //         await this.customerService.setPassword(
    //             authVerified.id,
    //             input.password,
    //         );
    //         return {
    //             status: 'success',
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}
