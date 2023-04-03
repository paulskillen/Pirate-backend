import { Field, Int, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';

@ObjectType()
export class CustomerOrderDto extends OmitType(OrderDto, [
    'expired',
    'updatedAt',
]) {}

@ObjectType()
export class CustomerOrderDetailResponse {
    @Field(() => CustomerOrderDto, { nullable: true, defaultValue: null })
    data: CustomerOrderDto;
}

@ObjectType()
export class CustomerOrderPaginateResponse {
    @Field(() => [CustomerOrderDto])
    data: CustomerOrderDto[];

    @Field()
    pagination?: PaginateResponse;
}

@ObjectType()
export class CustomerOrderBasicDto extends PickType(CustomerOrderDto, [
    'id',
    'orderNo',
    'status',
]) {}
