import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { IPaginationResult } from 'src/common/helper/paginate.helper';
import { CountryService } from 'src/modules/country/country.service';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';
import { GqlAuthGuard } from '../admin-auth/guard/gql-auth.guard';
import { AdminRoleService } from '../admin-role/admin-role.service';
import { AdminUserService } from './admin-user.service';
import {
    AdminUserDto,
    DetailAdminUserResponse,
    ListAdminUserResponse,
    SearchAdminUserResponse,
} from './dto/admin-user.dto';
import {
    CreateAdminUserInput,
    ListAdminUserInput,
    SearchAdminUserInput,
    UpdateAdminUserInput,
} from './dto/admin-user.input';

@Resolver(() => AdminUserDto)
export class AdminUserResolver {
    constructor(
        private readonly adminUserService: AdminUserService,
        private adminRoleService: AdminRoleService,
        private countryService: CountryService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @AdminAuthorization(PERMISSION.ADMIN.SEARCH)
    @Query(() => SearchAdminUserResponse)
    async searchAdminUserForAdmin(
        @Args('paginate') paginate: SearchAdminUserInput,
    ): Promise<IPaginationResult> {
        return this.adminUserService.findAll(paginate);
    }

    @AdminAuthorization(PERMISSION.ADMIN.LIST)
    @Query(() => ListAdminUserResponse)
    async listAdminUserForAdmin(
        @Args('paginate') paginate: ListAdminUserInput,
    ): Promise<IPaginationResult> {
        return this.adminUserService.findAll({
            ...paginate,
            sort: { _id: -1 },
        });
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => DetailAdminUserResponse)
    async getAdminProfileForAdmin(@CurrentAdmin() admin: any): Promise<any> {
        return {
            data: this.adminUserService.detail(admin?._id),
            countries: this.countryService.findAll(),
        };
    }

    @AdminAuthorization(PERMISSION.ADMIN.DETAIL)
    @Query(() => DetailAdminUserResponse)
    async detailAdminUserForAdmin(@Args('id') id: string): Promise<any> {
        return {
            data: this.adminUserService.detail(id),
        };
    }

    @AdminAuthorization(PERMISSION.ADMIN.CREATE)
    @Mutation(() => DetailAdminUserResponse)
    async createAdminUserForAdmin(
        @Args('payload') payload: CreateAdminUserInput,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        return { data: this.adminUserService.create(payload, admin) };
    }

    @AdminAuthorization(PERMISSION.ADMIN.UPDATE)
    @Mutation(() => DetailAdminUserResponse)
    async updateAdminUserForAdmin(
        @Args('id') id: string,
        @Args('payload') payload: UpdateAdminUserInput,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        return { data: this.adminUserService.update(id, payload, admin) };
    }

    @AdminAuthorization(PERMISSION.ADMIN.RESET_PASSWORD)
    @Mutation(() => Boolean)
    async resetPasswordAdminUserForAdmin(
        @Args('id') id: string,
        @Args('pw') pw: string,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.adminUserService.resetPassword(id, pw, admin);
        return data;
    }

    @ResolveField()
    async role(@Parent() parent): Promise<any> {
        const { role } = parent;
        if (!role) {
            return null;
        }
        return this.adminRoleService.detail(role);
    }
}
