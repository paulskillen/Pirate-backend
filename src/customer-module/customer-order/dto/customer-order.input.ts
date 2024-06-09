import {
    Field,
    GraphQLISODateTime,
    InputType,
    Int,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';

@InputType()
export class CustomerSendEmailAfterOrderInput {
    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    customerId?: string;

    @Field(() => String, { nullable: true })
    orderId?: string;

    @Field(() => Int, { nullable: true })
    retryEffortCount?: number;
}
