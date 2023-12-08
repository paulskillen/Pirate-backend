import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UploadModeStatus } from '../upload.constant';

@ObjectType()
export class UploadResultDto {
    @Field({ nullable: true })
    fileName?: string;

    @Field({ nullable: true })
    fileUrl?: string;

    @Field({ nullable: true })
    type?: string;

    @Field(() => String, { nullable: true })
    status?: UploadModeStatus;
}

@ObjectType()
export class UploadUrlDto {
    @Field({ nullable: true })
    uploadUrl?: string;

    @Field({ nullable: true })
    fileName?: string;

    @Field({ nullable: true })
    fileUrl?: string;

    @Field(() => String, { nullable: true })
    status?: UploadModeStatus;
}

@ObjectType()
export class DeleteFileResultDto {
    @Field({ nullable: true })
    fileName?: string;

    @Field({ nullable: true })
    deleted?: boolean;
}

@InputType()
export class UploadFileInputDto {
    @Field((type) => [String])
    file: string[];
}

@ObjectType()
export class GenerateUrlResponse {
    @Field(() => UploadUrlDto, { nullable: true, defaultValue: null })
    data: UploadUrlDto;
}
