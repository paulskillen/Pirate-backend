import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CustomerStatus } from 'src/modules/customer/customer.constant';
import { CustomerRegisterInput } from 'src/modules/customer/dto/customer.input';
import { ErrorNotFound } from 'src/common/errors/errors.constant';
import { Customer } from 'src/modules/customer/schema/customer.schema';

export type AuthPayload = {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    isVerified: boolean;
};

@Injectable()
export class CustomerAuthService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<Customer> {
        const customer: any = await this.customerService.login(email);

        if (
            customer &&
            customer?.status === CustomerStatus.ACTIVE &&
            bcrypt.compareSync(pass, customer.password)
        ) {
            return customer;
        }
        return null;
    }

    async login(email: string, password: string): Promise<any | null> {
        try {
            const payload: Customer = await this.validateUser(email, password);
            if (!payload) {
                throw new AuthenticationError('Email or Password Invalid');
            }

            // if (!payload.isVerified) {
            //     const authOtpSms = await this.otpService.requestSmsOtp(phone);
            //     return {
            //         otpToken: authOtpSms.token,
            //         customerId: payload.id,
            //         isVerified: false,
            //     };
            // }

            const accessToken = await this.getJwtAccessToken(payload?._id);
            return {
                accessToken,
                isVerified: true,
                isRegistered: true,
                profile: payload,
            };
        } catch (error) {
            throw error;
        }
    }

    async loginSocial(profile: any): Promise<any | null> {
        try {
            const customer: any = await this.customerService.socialLogin(
                profile.socialId,
            );
            if (!customer) {
                return { isRegistered: false, profile };
            }

            if (customer && customer?.status === CustomerStatus.IN_ACTIVE) {
                throw new AuthenticationError(
                    'Your account be suspended. Please contact our customer service for more information.',
                );
            }

            // if (!customer.isVerified) {
            //     return {
            //         otpToken: authOtpSms.token,
            //         customerId: customer.id,
            //         isVerified: false,
            //         isRegistered: true,
            //         profile: {
            //             id: customer?.id,
            //             socialId: customer?.socialId,
            //             email: customer?.email,
            //             firstName: customer?.firstName,
            //             lastName: customer?.lastName,
            //             phone: customer?.phone,
            //         },
            //     };
            // }

            const accessToken = await this.getJwtAccessToken(customer?._id);
            return {
                isRegistered: true,
                isVerified: true,
                accessToken,
                profile: customer,
            };
        } catch (error) {
            throw error;
        }
    }

    async register(input: CustomerRegisterInput): Promise<any | null> {
        try {
            const newCustomer = {
                status: CustomerStatus.ACTIVE,
                title: input.title,
                firstName: input.firstName,
                lastName: input.lastName,
                password: input.password,
                email: input.email,
                phone: input?.phone,
                phoneCode: input?.phoneCode,
                socialId: input?.socialId,
                avatar:
                    input?.avatar ??
                    'https://aws-s3-dehygienique.s3.amazonaws.com/W2Zp73lxjkwrHAYqlG7PAbXsUUBLUL4avAge.webp',
            };
            const customer = await this.customerService.create(
                newCustomer as any,
            );
            return customer;
        } catch (error) {
            throw error;
        }
    }

    public getJwtAccessToken(id: string, isOtpAuthenticated = false) {
        const payload = { id, isOtpAuthenticated };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }
}
