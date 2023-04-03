import {
    Field,
    GraphQLISODateTime,
    InputType,
    Int,
    OmitType,
    PartialType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { ProviderName } from 'src/modules/provider/provider.constant';

@InputType()
export class OrderProductInput {
    @Field()
    id: string;

    @Field(() => Int, { defaultValue: 1 })
    quantity: number;
}

@InputType()
export class OrderCreateInput {
    @Field({ nullable: true })
    customer?: string;

    @Field(() => [OrderProductInput])
    products: OrderProductInput[];

    @Field(() => ProviderName)
    provider: ProviderName;

    @Field({ nullable: true })
    remark?: string;
}

@InputType()
export class OrderUpdateInput extends PartialType(OrderCreateInput) {}

@InputType()
export class OrderPaginateInput extends PaginateRequest {}
