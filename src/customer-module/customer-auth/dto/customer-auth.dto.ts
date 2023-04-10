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
}

@ObjectType()
export class LoginSocialResponseDto {
    @Field({ nullable: true })
    accessToken?: string;

    @Field(() => CustomerDto, { nullable: true })
    profile?: CustomerDto;
}
