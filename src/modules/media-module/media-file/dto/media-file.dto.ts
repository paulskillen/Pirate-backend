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
import { MediaFolderDto } from '../../media-folder/dto/media-folder.dto';

@ObjectType()
export class MediaFileDto extends BaseDto {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    fileName: string;

    @Field()
    fileUrl: string;

    @Field({ nullable: true })
    type?: string;

    @Field(() => MediaFolderDto, { nullable: true })
    folder?: MediaFolderDto;

    @Field(() => Float, { nullable: true })
    size?: number;

    @Field({ nullable: true })
    dimension?: string;
}

@InputType()
export class MediaFileCreateRequest {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    fileName: string;

    @Field()
    fileUrl: string;

    @Field()
    type: string;

    @Field(() => String, { nullable: true })
    folderId?: string;

    @Field(() => Float, { nullable: true })
    size?: number;

    @Field({ nullable: true })
    dimension?: string;
}

@InputType()
export class MediaFileUpdateRequest extends PartialType(
    PickType(MediaFileCreateRequest, ['title', 'description']),
) {}

@InputType()
export class MediaFilePaginateRequest extends PaginateRequest {
    @Field(() => String, { nullable: true })
    folderId: string;
}

@ObjectType()
export class MediaFileDetailResponse {
    @Field(() => MediaFileDto, { nullable: true, defaultValue: null })
    data: MediaFileDto;
}

@ObjectType()
export class MediaFileAllResponse {
    @Field(() => [MediaFileDto])
    data: MediaFileDto[];
}

@ObjectType()
export class MediaFilePaginateResponse extends MediaFileAllResponse {
    @Field()
    pagination?: PaginateResponse;
}
