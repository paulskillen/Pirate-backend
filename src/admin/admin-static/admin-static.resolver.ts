import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PERMISSION } from 'src/common/constant/permission.constant';
import { StaticDetailResponse } from 'src/modules/static/dto/static.dto';
import { StaticUpdateInput } from 'src/modules/static/dto/static.input';
import { StaticPageTemplate } from 'src/modules/static/static.constant';
import { StaticService } from 'src/modules/static/static.service';
import { AdminAuthorization } from '../admin-auth/decorator/authorization.decorator';
import { CurrentAdmin } from '../admin-auth/decorator/current-admin.decorator';

@Resolver()
export class AdminStaticResolver {
    constructor(private readonly staticService: StaticService) {}

    @AdminAuthorization(PERMISSION.STATIC.DETAIL)
    @Query(() => StaticDetailResponse)
    async detailStaticPageForAdmin(
        @Args('template') template: StaticPageTemplate,
    ): Promise<any> {
        const data = this.staticService.findOne({ template });
        return { data };
    }

    @AdminAuthorization(PERMISSION.STATIC.UPDATE)
    @Mutation(() => StaticDetailResponse)
    async updateStaticPageForAdmin(
        @Args('template') template: StaticPageTemplate,
        @Args('payload') payload: StaticUpdateInput,
        @CurrentAdmin() admin: any,
    ): Promise<any> {
        const data = await this.staticService.updateByTemplate(
            template,
            payload,
            admin,
        );
        return { data };
    }
}
