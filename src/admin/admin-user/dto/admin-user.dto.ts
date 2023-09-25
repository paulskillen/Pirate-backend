import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
    PickType,
} from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { AdminRole } from 'src/admin/admin-role/dto/admin-role.dto';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus } from 'src/modules/order/order.constant';
import { SpecialAccessType } from '../admin-user.constant';

@ObjectType()
export class SpecialAccess {
    @Field(() => Boolean, { nullable: true })
    status: boolean;

    @Field(() => String, { nullable: true })
    code: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    expired: Date;

    @Field(() => SpecialAccessType, { nullable: true })
    specialAccessType: SpecialAccessType;
}

@ObjectType()
export class AdminUserDto extends BaseDto {
    @Field(() => Int, { nullable: true })
    adminNo: number;

    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => String, { nullable: true })
    nickName: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    companyId: string;

    @Field(() => AdminRole, { nullable: true })
    role: AdminRole;

    @Field((type) => GraphQLISODateTime, { nullable: true })
    lastLogin: Date;

    @Field(() => Boolean, { nullable: true })
    authenticationStatus: boolean;

    @Field(() => String, { nullable: true })
    authenticationCode: string;

    @Field(() => [OrderStatus], { nullable: true })
    orderStatusManagement: OrderStatus[];

    @Field(() => SpecialAccess, { nullable: true })
    specialAccess: SpecialAccess;

    @Field(() => Boolean, { nullable: true })
    status: boolean;
}

@ObjectType()
export class DetailAdminUserResponse {
    @Field(() => AdminUserDto, { nullable: true, defaultValue: null })
    data: AdminUserDto;
}

@ObjectType()
export class ListAdminUserResponse {
    @Field(() => [AdminUserDto], { nullable: true, defaultValue: [] })
    data: AdminUserDto[];

    @Field(() => PaginateResponse, {})
    pagination: PaginateResponse;
}

@ObjectType()
export class AdminUserBasic extends PickType(AdminUserDto, [
    'id',
    'adminNo',
    'firstName',
    'lastName',
    'nickName',
    'avatar',
    'companyId',
    'updatedAt',
    'createdAt',
]) {}

@ObjectType()
export class SearchAdminUserResponse {
    @Field(() => [AdminUserBasic], { nullable: true, defaultValue: [] })
    data: AdminUserBasic[];

    @Field(() => PaginateResponse, {})
    pagination: PaginateResponse;
}
