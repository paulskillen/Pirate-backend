import { Field, InputType } from '@nestjs/graphql';
import { EsimGoBundlePaginateInput } from 'src/modules/provider/eSim-go/dto/bundle/eSimGo-bundle.input';

@InputType()
export class ProviderBundlePaginateInput extends EsimGoBundlePaginateInput {}

@InputType()
export class BundleConfigInput {
    @Field(() => Number, { nullable: true })
    price?: number;
}
