import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
import { CustomerBundleModule } from './customer-bundle/customer-bundle.module';
import { CustomerCountryModule } from './customer-country/customer-country.module';
import { CustomerESimModule } from './customer-esim/customer-esim.module';
import { CustomerOrderModule } from './customer-order/customer-order.module';
import { CustomerUserModule } from './customer-user/customer-user.module';

@Module({
    imports: [
        CustomerESimModule,
        CustomerCountryModule,
        CustomerBundleModule,
        CustomerOrderModule,
        CustomerUserModule,
        CustomerAuthModule,
    ],
})
export class CustomerModuleModules {}
