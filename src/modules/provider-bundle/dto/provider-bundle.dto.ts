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

    @Field(() => JSON, { nullable: true })
    dataAmount: any;

    @Field(() => JSON, { nullable: true })
    duration: any;

    @Field(() => JSON, { nullable: true })
    price: any;

    @Field(() => JSON, { nullable: true })
    salePrice?: any;

    @Field(() => JSON, { nullable: true })
    bundleData?: any;
}

@ObjectType()
export class ProviderBundlePaginateResponse {
    @Field(() => [ProviderBundleDto])
    data: ProviderBundleDto[];

    @Field({ nullable: true })
    pagination?: PaginateResponse;
}
