import { InputType } from '@nestjs/graphql';
import {
    CustomerCreateInput,
    CustomerPaginateInput,
} from 'src/modules/customer/dto/customer.input';

@InputType()
export class AdminCustomerCreateInput extends CustomerCreateInput {}

@InputType()
export class AdminCustomerPaginateRequest extends CustomerPaginateInput {}
