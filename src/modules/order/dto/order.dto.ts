import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus, OrderStockAdjustmentStatus } from '../order.constant';

@ObjectType()
export class OrderDto extends BaseDto {
    @Field(() => String)
    orderNo: string;

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

@ObjectType()
export class OrderDetailResponse {
    @Field(() => OrderDto, { nullable: true, defaultValue: null })
    data: OrderDto;
}

@ObjectType()
export class OrderPaginateResponse {
    @Field(() => [OrderDto])
    data: OrderDto[];

    @Field()
    pagination?: PaginateResponse;
}

@ObjectType()
export class OrderBasicDto extends PickType(OrderDto, ['id', 'name', 'code']) {}
