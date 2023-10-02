import {
    Field,
    Float,
    InputType,
    ObjectType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { BaseDto } from 'src/common/base/base.dto';
import {
    PaginateRequest,
    PaginateResponse,
} from 'src/common/paginate/dto/paginate.dto';

@ObjectType()
export class MediaFolderDto extends BaseDto {
    @Field()
    name?: string;

    @Field(() => MediaFolderDto, { nullable: true })
    parent?: MediaFolderDto;

    @Field(() => Float, { nullable: true })
    size?: number;

    @Field(() => [MediaFolderDto], { nullable: true })
    children?: MediaFolderDto[];
}

@InputType()
export class MediaFolderCreateRequest {
    @Field()
    name: string;

    @Field({ nullable: true })
    parentId?: string;
}

@InputType()
export class MediaFolderUpdateRequest extends PartialType(
    PickType(MediaFolderCreateRequest, ['name']),
) {}

@InputType()
export class MediaFolderPaginateRequest extends PaginateRequest {
    @Field(() => String, { nullable: true })
    parentId?: string;
}

@ObjectType()
export class MediaFolderDetailResponse {
    @Field(() => MediaFolderDto, { nullable: true, defaultValue: null })
    data: MediaFolderDto;
}

@ObjectType()
export class MediaFolderAllResponse {
    @Field(() => [MediaFolderDto])
    data: MediaFolderDto[];
}

@ObjectType()
export class MediaFolderPaginateResponse extends MediaFolderAllResponse {
    @Field()
    pagination?: PaginateResponse;
}
