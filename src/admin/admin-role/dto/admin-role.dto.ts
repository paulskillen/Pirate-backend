import {
    Field,
    ID,
    InputType,
    ObjectType,
    GraphQLISODateTime,
    Int,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import {
    PaginateResponse,
    PaginateRequest,
} from 'src/common/paginate/dto/paginate.dto';

@ObjectType()
export class AdminRole {
    @Field(() => ID, { nullable: true })
    id?: string;

    @Field(() => JSON, { nullable: true })
    updatedAt?: Date;

    @Field(() => JSON, { nullable: true })
    createdAt?: Date;

    @Field(() => Int, { nullable: true })
    roleNo: number;

    @Field(() => String)
    name: string;

    @Field(() => Boolean, { nullable: true, defaultValue: false })
    isAdmin: boolean;

    @Field(() => [String], { nullable: true, defaultValue: [] })
    permissions: string[];
}

@InputType()
export class CreateAdminRoleRequest {
    @Field(() => String)
    name: string;

    @Field(() => Boolean, { nullable: true })
    isAdmin: boolean;

    @Field(() => [String], { nullable: true })
    permissions: string[];
}

@InputType()
export class UpdateAdminRoleRequest extends PartialType(
    CreateAdminRoleRequest,
) {
    @Field(() => String, { nullable: true })
    name: string;
}

@ObjectType()
export class DetailAdminRoleResponse {
    @Field(() => AdminRole, { nullable: true, defaultValue: null })
    data: AdminRole;
}

@ObjectType()
export class ListAdminRoleResponse {
    @Field(() => [AdminRole], { nullable: true, defaultValue: [] })
    data: AdminRole[];

    @Field(() => PaginateResponse, {})
    pagination: PaginateResponse;
}

@InputType()
export class ListAdminRoleRequest extends PaginateRequest {}

@ObjectType()
export class AdminRoleBasic extends PickType(AdminRole, [
    'id',
    'roleNo',
    'name',
] as const) {}

@ObjectType()
export class AllAdminRoleResponse {
    @Field(() => [AdminRoleBasic], { nullable: true, defaultValue: [] })
    data: AdminRoleBasic[];
}
