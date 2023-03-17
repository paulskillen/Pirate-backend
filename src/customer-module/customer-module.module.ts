import { Module } from '@nestjs/common';
import { CustomerBundleModule } from './customer-bundle/customer-bundle.module';
import { CustomerCountryModule } from './customer-country/customer-country.module';
import { CustomerESimModule } from './customer-esim/customer-esim.module';

@Module({
    imports: [CustomerESimModule, CustomerCountryModule, CustomerBundleModule],
})
export class CustomerModuleModules {}
