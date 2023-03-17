import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';

@ObjectType()
export class ProviderBundleDto extends BaseDto {
    @Field(() => ProviderName)
    provider: ProviderName;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    dataAmount: string;

    @Field(() => String, { nullable: true })
    duration: string;

    @Field({ nullable: true })
    price: string;

    @Field(() => JSON, { nullable: true })
    bundleData?: JSON;
}

@ObjectType()
export class ProviderBundlePaginateResponse {
    @Field(() => [ProviderBundleDto])
    data: ProviderBundleDto[];

    @Field()
    pagination?: PaginateResponse;
}
