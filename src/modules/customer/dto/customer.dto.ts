import { Field, ObjectType, PickType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { CustomerTitle, Gender } from '../customer.constant';

@ObjectType()
export class CustomerDto extends BaseDto {
    @Field({ nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    customerNo: string;

    @Field(() => CustomerTitle, { nullable: true })
    title: CustomerTitle;

    @Field({ nullable: true })
    fullName: string;

    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    nickname: string;

    @Field({ nullable: true })
    socialId: string;

    @Field(() => Gender, { nullable: true })
    gender: Gender;

    @Field(() => JSON, { nullable: true })
    birthDay?: Date;

    // contact information

    @Field({ nullable: true })
    phoneCode?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    lineId?: string;

    @Field({ nullable: true })
    instagram?: string;

    @Field({ nullable: true })
    facebook?: string;
}

@ObjectType()
export class CustomerDetailResponse {
    @Field(() => CustomerDto, { nullable: true, defaultValue: null })
    data: CustomerDto;
}

@ObjectType()
export class CustomerPaginateResponse {
    @Field(() => [CustomerDto])
    data: CustomerDto[];

    @Field()
    pagination?: PaginateResponse;
}

@ObjectType()
export class CustomerBasicDto extends PickType(CustomerDto, [
    'id',
    'avatar',
    'firstName',
    'lastName',
    'fullName',
    'nickname',
    'gender',
    'phone',
    'email',
    'customerNo',
]) {}
