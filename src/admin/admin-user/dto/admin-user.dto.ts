import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
} from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { AdminRole } from 'src/admin/admin-role/dto/admin-role.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus } from 'src/modules/order/order.constant';
import { SpecialAccessType } from '../admin-user.constant';

@ObjectType()
export class AdminUserBasic {
    @Field(() => ID, { nullable: true })
    id?: string;

    @Field(() => JSON, { nullable: true })
    updatedAt?: Date;

    @Field(() => JSON, { nullable: true })
    createdAt?: Date;

    @Field(() => Int, { nullable: true })
    adminNo: number;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => String, { nullable: true })
    nickName: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    companyId: string;
}

@ObjectType()
export class DefaultWorkingScheduleTime {
    @Field(() => Number, { nullable: true })
    start?: number;

    @Field(() => Number, { nullable: true })
    end?: number;
}

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
export class AdminUser {
    @Field(() => ID, { nullable: true })
    id?: string;

    @Field(() => JSON, { nullable: true })
    updatedAt?: Date;

    @Field(() => JSON, { nullable: true })
    createdAt?: Date;

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
    @Field(() => AdminUser, { nullable: true, defaultValue: null })
    data: AdminUser;
}

@ObjectType()
export class ListAdminUserResponse {
    @Field(() => [AdminUser], { nullable: true, defaultValue: [] })
    data: AdminUser[];

    @Field(() => PaginateResponse, {})
    pagination: PaginateResponse;
}

@ObjectType()
export class SearchAdminUserResponse {
    @Field(() => [AdminUserBasic], { nullable: true, defaultValue: [] })
    data: AdminUserBasic[];

    @Field(() => PaginateResponse, {})
    pagination: PaginateResponse;
}
