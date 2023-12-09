import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { StaticPageTemplate } from '../static.constant';
import { AdminUserBasicDto } from 'src/admin/admin-user/dto/admin-user.dto';

@ObjectType()
export class StaticDto extends BaseDto {
    @Field(() => StaticPageTemplate)
    template: StaticPageTemplate;

    @Field()
    name: string;

    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    subTitle: string;

    @Field(() => String, { nullable: true })
    content: string;

    @Field(() => AdminUserBasicDto, { nullable: true })
    updatedByAdmin?: AdminUserBasicDto;
}

@ObjectType()
export class StaticDetailResponse {
    @Field(() => StaticDto, { nullable: true, defaultValue: null })
    data: StaticDto;
}

@ObjectType()
export class StaticPaginateResponse {
    @Field(() => [StaticDto])
    data: StaticDto[];

    @Field()
    pagination?: PaginateResponse;
}
