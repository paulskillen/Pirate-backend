import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import {
    CreateAdminRoleRequest,
    UpdateAdminRoleRequest,
    ListAdminRoleInput,
    ListAdminRoleResponse,
    DetailAdminRoleResponse,
    AllAdminRoleResponse,
} from './dto/admin-role.dto';
import { AdminRoleService } from './admin-role.service';
import { IPaginationResult } from 'src/common/helper/paginate.helper';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';
import { PERMISSION } from 'src/common/constant/permission.constant';

@Resolver()
export class AdminRoleResolver {
    constructor(private readonly adminRoleService: AdminRoleService) {}

    @AdminAuthorization(PERMISSION.ADMIN.ROLE.LIST)
    @Query(() => ListAdminRoleResponse)
    async listAdminRoleForAdmin(
        @Args('paginate') paginate: ListAdminRoleInput,
    ): Promise<IPaginationResult> {
        return this.adminRoleService.findAll(paginate);
    }

    @AdminAuthorization(PERMISSION.ADMIN.ROLE.DETAIL)
    @Query(() => DetailAdminRoleResponse)
    async detailAdminRoleForAdmin(@Args('id') id: string): Promise<any> {
        return { data: this.adminRoleService.detail(id) };
    }

    @AdminAuthorization(PERMISSION.ADMIN.ROLE.CREATE)
    @Mutation(() => DetailAdminRoleResponse)
    async createAdminRoleForAdmin(
        @Args('payload') payload: CreateAdminRoleRequest,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        return { data: this.adminRoleService.create(payload, admin) };
    }

    @AdminAuthorization(PERMISSION.ADMIN.ROLE.UPDATE)
    @Mutation(() => DetailAdminRoleResponse)
    async updateAdminRoleForAdmin(
        @Args('id') id: string,
        @Args('payload') payload: UpdateAdminRoleRequest,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        return { data: this.adminRoleService.update(id, payload, admin) };
    }

    @AdminAuthorization(PERMISSION.ADMIN.ROLE.ALL)
    @Query(() => AllAdminRoleResponse)
    async allAdminRoleForAdmin(): Promise<any> {
        return { data: this.adminRoleService.all() };
    }
}
