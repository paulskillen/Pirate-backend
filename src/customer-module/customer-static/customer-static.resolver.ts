import { Args, Query, Resolver } from '@nestjs/graphql';
import { StaticDetailResponse } from 'src/modules/static/dto/static.dto';
import { StaticPageTemplate } from 'src/modules/static/static.constant';
import { StaticService } from 'src/modules/static/static.service';

@Resolver()
export class CustomerStaticResolver {
    constructor(private readonly staticService: StaticService) {}
    @Query(() => StaticDetailResponse)
    async detailStaticPageForAdmin(
        @Args('template') template: StaticPageTemplate,
    ): Promise<any> {
        const data = this.staticService.findOne({ template });
        return { data };
    }
}
