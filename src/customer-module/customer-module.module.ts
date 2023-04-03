import { Module } from '@nestjs/common';
import { CustomerBundleModule } from './customer-bundle/customer-bundle.module';
import { CustomerCountryModule } from './customer-country/customer-country.module';
import { CustomerESimModule } from './customer-esim/customer-esim.module';
import { CustomerOrderModule } from './customer-order/customer-order.module';

@Module({
    imports: [
        CustomerESimModule,
        CustomerCountryModule,
        CustomerBundleModule,
        CustomerOrderModule,
    ],
})
export class CustomerModuleModules {}
