import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { CustomerDto } from 'src/modules/customer/dto/customer.dto';

export class RegisterResponseDto {}

@ObjectType()
export class LoginResponseDto {
    @Field({ nullable: true })
    accessToken?: string;

    @Field(() => CustomerDto, { nullable: true })
    profile?: CustomerDto;

    @Field({ nullable: true })
    isRegistered?: boolean;

    @Field({ nullable: true })
    isVerified?: boolean;
}

@ObjectType()
export class LoginSocialResponseDto {
    @Field({ nullable: true })
    accessToken?: string;

    @Field({ nullable: true })
    isRegistered?: boolean;

    @Field({ nullable: true })
    isVerified?: boolean;

    @Field(() => CustomerDto, { nullable: true })
    profile?: CustomerDto;
}
