import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { CustomerTitle, Gender } from '../customer.constant';

@ObjectType()
export class CustomerDto extends BaseDto {
    @Field({ nullable: true })
    avatar?: string;

    @Field(() => Int, { nullable: true })
    customerId: number;

    @Field(() => String, { nullable: true })
    customerNo: string;

    @Field(() => CustomerTitle, { nullable: true })
    title: CustomerTitle;

    @Field({ nullable: true })
    fullNameTh: string;

    @Field({ nullable: true })
    fullNameEn: string;

    @Field({ nullable: true })
    firstNameTh: string;

    @Field({ nullable: true })
    lastNameTh: string;

    @Field({ nullable: true })
    firstNameEn: string;

    @Field({ nullable: true })
    lastNameEn: string;

    @Field({ nullable: true })
    nickname: string;

    @Field(() => Gender, { nullable: true })
    gender: Gender;

    @Field(() => JSON, { nullable: true })
    birthDay?: Date;

    // privacy information

    @Field({ nullable: true })
    citizenId: string;

    //   @Field(() => CountryDto, { nullable: true })
    //   nationality: CountryDto;

    @Field({ nullable: true })
    passportNo?: string;

    @Field(() => JSON, { nullable: true })
    passportExp?: Date;

    @Field({ nullable: true })
    religion?: string;

    @Field({ nullable: true })
    maritalStatus: string;

    @Field({ nullable: true })
    numberOfChild?: number;

    // contact information

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    alternativePhone: string;

    @Field({ nullable: true })
    email?: string;

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
    'firstNameEn',
    'lastNameEn',
    'firstNameTh',
    'lastNameTh',
    'nickname',
    'gender',
    'phone',
    'email',
    'customerId',
    'birthDay',
]) {}
