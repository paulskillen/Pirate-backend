import { Field, InputType, PartialType } from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { StaticPageTemplate } from '../static.constant';

@InputType()
export class StaticCreateInput {
    @Field(() => StaticPageTemplate)
    template: StaticPageTemplate;

    @Field()
    name: string;

    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    subTitle: string;

    @Field(() => String)
    content: string;
}

@InputType()
export class StaticUpdateInput extends PartialType(StaticCreateInput) {}

@InputType()
export class StaticPaginateInput extends PaginateRequest {}
