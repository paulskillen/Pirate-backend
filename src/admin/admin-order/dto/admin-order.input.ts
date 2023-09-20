import { InputType } from '@nestjs/graphql';
import { OrderCreateInput } from 'src/modules/order/dto/order.input';

@InputType()
export class AdminOrderCreateInput extends OrderCreateInput {}
