import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { AdminUserBasicDto } from 'src/admin/admin-user/dto/admin-user.dto';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { BlogStatus } from '../blog.constant';

@ObjectType()
export class BlogDto extends BaseDto {
    @Field(() => String)
    blogNo: string;

    @Field(() => BlogStatus)
    status: BlogStatus;

    @Field(() => String)
    title: string;

    @Field(() => String)
    fullDesc: string;

    @Field(() => String, { nullable: true })
    shortDesc: string;

    @Field(() => String, { nullable: true })
    cover: string;

    @Field(() => String)
    category: string;

    @Field(() => Boolean, { nullable: true })
    homePageVisibility?: boolean;

    @Field(() => AdminUserBasicDto, { nullable: true })
    createByAdmin: AdminUserBasicDto;
}

@ObjectType()
export class BlogDetailResponse {
    @Field(() => BlogDto, { nullable: true, defaultValue: null })
    data: BlogDto;
}

@ObjectType()
export class BlogPaginateResponse {
    @Field(() => [BlogDto])
    data: BlogDto[];

    @Field()
    pagination?: PaginateResponse;
}

@ObjectType()
export class BlogBasicDto extends PickType(BlogDto, [
    'id',
    'title',
    'fullDesc',
    'shortDesc',
]) {}
