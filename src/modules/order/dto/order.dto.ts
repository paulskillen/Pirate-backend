import { Field, Float, Int, ObjectType, PickType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/base/base.dto';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { CustomerBasicDto } from 'src/modules/customer/dto/customer.dto';
import { ProviderBundleDto } from 'src/modules/provider-bundle/dto/provider-bundle.dto';
import {
    OrderStatus,
    OrderPaymentStatus,
    PaymentMethod,
} from '../order.constant';
import JSON from 'graphql-type-json';

@ObjectType()
export class OrderProductDto {
    @Field(() => ProviderBundleDto)
    product: ProviderBundleDto;

    @Field(() => Int)
    quantity: number;
}

@ObjectType()
export class OrderPaymentDto {
    @Field(() => JSON, { nullable: true })
    paymentData: any;

    @Field(() => JSON, { nullable: true })
    updatedAt?: Date;

    @Field(() => JSON, { nullable: true })
    createdAt?: Date;

    @Field(() => PaymentMethod, { nullable: true })
    method?: PaymentMethod;

    @Field(() => OrderPaymentStatus)
    status?: OrderPaymentStatus;
}

@ObjectType()
export class OrderDto extends BaseDto {
    @Field(() => String)
    orderNo: string;

    @Field(() => OrderStatus)
    status: OrderStatus;

    @Field(() => CustomerBasicDto, { nullable: true })
    customer: CustomerBasicDto;

    @Field(() => [OrderProductDto], { defaultValue: [] })
    products: OrderProductDto[];

    @Field(() => [OrderPaymentDto], { defaultValue: [] })
    payment: OrderPaymentDto[];

    @Field(() => JSON, { nullable: true })
    expiryDate?: Date;

    @Field({ nullable: true })
    remark: string;

    @Field(() => Float)
    total: number;

    @Field(() => Float)
    subTotal: number;
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
export class OrderBasicDto extends PickType(OrderDto, [
    'id',
    'orderNo',
    'status',
]) {}
