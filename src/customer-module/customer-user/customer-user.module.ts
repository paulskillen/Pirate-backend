import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { CustomerUserResolver } from './customer-user.resolver';

@Module({
    imports: [CustomerModule],
    providers: [CustomerUserResolver],
    exports: [CustomerUserResolver, CustomerModule],
})
export class CustomerUserModule {}
