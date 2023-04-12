import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CustomerRegisterInput } from 'src/modules/customer/dto/customer.input';
import AppleAuth from 'src/modules/third-party/apple.auth';
import FacebookAuth from 'src/modules/third-party/facebook.auth';
import GoogleAuth from 'src/modules/third-party/google.auth';
import { SocialProvider } from './customer-auth.constant';
import { CustomerAuthService } from './customer-auth.service';
import {
    LoginResponseDto,
    LoginSocialResponseDto,
} from './dto/customer-auth.dto';
import JSON from 'graphql-type-json';
import { LoginInput } from './dto/customer-auth.input';

@Resolver()
export class CustomerAuthResolver {
    constructor(
        private customerAuthService: CustomerAuthService,
        private customerService: CustomerService,
        private jwtService: JwtService,
    ) {}

    @Mutation(() => LoginResponseDto)
    async login(@Args('input') input: LoginInput): Promise<LoginResponseDto> {
        try {
            const { username, password } = input;
            const loginResponse = await this.customerAuthService.login(
                username,
                password,
            );
            return loginResponse;
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => LoginResponseDto)
    async register(
        @Args('input') input: CustomerRegisterInput,
    ): Promise<LoginResponseDto> {
        try {
            const registerRes = await this.customerAuthService.register(input);
            return { ...registerRes, otpToken: registerRes.token };
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => LoginSocialResponseDto)
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
            const loginResponse = await this.customerAuthService.loginSocial(
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
