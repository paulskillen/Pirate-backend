import { Field, InputType, PartialType } from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { BlogStatus } from '../blog.constant';

@InputType()
export class BlogCreateRequest {
    @Field()
    slug: string;

    @Field()
    title: string;

    @Field()
    fullDesc: string;

    @Field(() => String, { nullable: true })
    shortDesc?: string;

    @Field(() => String, { nullable: true })
    cover?: string;

    @Field(() => String, { nullable: true })
    thumbnail?: string;

    @Field(() => String, { nullable: true })
    category?: string;

    @Field(() => Boolean, { nullable: true })
    homePageVisibility?: boolean;

    @Field(() => BlogStatus)
    status: BlogStatus;
}

@InputType()
export class BlogUpdateRequest extends PartialType(BlogCreateRequest) {}

@InputType()
export class BlogPaginateRequest extends PaginateRequest {
    @Field(() => [String], { nullable: true })
    category?: string[];

    @Field(() => Boolean, { nullable: true })
    homePageVisibility?: boolean;

    @Field(() => [BlogStatus], { nullable: true })
    status?: BlogStatus[];
}
