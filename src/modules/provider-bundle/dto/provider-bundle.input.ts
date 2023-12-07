import { InputType } from '@nestjs/graphql';
import { EsimGoBundlePaginateInput } from 'src/modules/provider/eSim-go/dto/bundle/eSimGo-bundle.input';

@InputType()
export class ProviderBundlePaginateInput extends EsimGoBundlePaginateInput {}
