import {
    Field,
    Float,
    GraphQLISODateTime,
    InputType,
    Int,
    OmitType,
    PartialType,
} from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';

@InputType()
export class ProviderBundlePaginateInput extends PaginateRequest {}
