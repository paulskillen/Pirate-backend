import {
    Field,
    GraphQLISODateTime,
    InputType,
    OmitType,
    PartialType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus, OrderStockAdjustmentStatus } from '../order.constant';

@InputType()
export class OrderCreateInput {
    @Field()
    name: string;

    @Field()
    code: string;

    @Field()
    pickupCode: string;

    @Field()
    brandTaxId: string;

    @Field()
    phone: string;

    @Field(() => OrderStatus)
    status: OrderStatus;

    @Field(() => OrderStockAdjustmentStatus)
    manualStockAdjustment: OrderStockAdjustmentStatus;
}

@InputType()
export class OrderUpdateInput extends PartialType(OrderCreateInput) {}

@InputType()
export class OrderPaginateInput extends PaginateRequest {}
