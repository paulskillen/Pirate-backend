import { Field, InputType } from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';

@InputType()
export class EsimGoBundlePaginateInput extends PaginateRequest {
    @Field(() => [String], { nullable: true })
    countries?: string[];
}
