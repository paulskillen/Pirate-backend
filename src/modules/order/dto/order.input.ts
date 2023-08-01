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
import { PaymentMethod } from '../order.constant';

@InputType()
export class OrderProductInput {
    @Field()
    id: string;

    @Field(() => Int, { defaultValue: 1 })
    quantity: number;

    @Field(() => String, { nullable: true })
    assignTo: string;

    @Field(() => ProviderName)
    provider: ProviderName;
}

@InputType()
export class OrderPaymentInput {
    @Field(() => PaymentMethod)
    method: PaymentMethod;

    @Field(() => Float)
    total: number;

    @Field(() => JSON, { nullable: true })
    paymentData?: any;
}

@InputType()
export class OrderCreateInput {
    @Field({ nullable: true })
    customer?: string;

    @Field(() => [OrderProductInput])
    products: OrderProductInput[];

    @Field({ nullable: true })
    remark?: string;
}

@InputType()
export class OrderUpdateInput extends PartialType(OrderCreateInput) {}

@InputType()
export class OrderProcessInput {
    @Field(() => [OrderPaymentInput])
    payment: OrderPaymentInput[];

    @Field({ nullable: true })
    customer?: string;
}

@InputType()
export class OrderPaginateInput extends PaginateRequest {}
