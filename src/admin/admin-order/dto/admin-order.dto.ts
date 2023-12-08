import { ObjectType, OmitType } from '@nestjs/graphql';
import { OrderDto } from 'src/modules/order/dto/order.dto';

@ObjectType()
export class AdminOrderDto extends OmitType(OrderDto, [
    'expiryDate',
    'updatedAt',
]) {}
