import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { CustomerActivity } from './activity/customer.activity';
import { CustomerGetter } from './customer.getter';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { Customer, CustomerSchema } from './schema/customer.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Customer.name, schema: CustomerSchema },
        ]),
        CacheModule.register({ isGlobal: true, max: 10000 }),
    ],
    providers: [
        CustomerResolver,
        CustomerService,
        CustomerGetter,
        // CustomerActivity,
    ],
    exports: [CustomerService, CustomerGetter, CustomerResolver],
})
export class CustomerModule {}
