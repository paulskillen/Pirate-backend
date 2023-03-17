import { forwardRef, Module } from '@nestjs/common';
import { CountryModule } from 'src/modules/country/country.module';
import { CustomerCountryResolver } from './customer-country.resolver';

@Module({
    imports: [CountryModule],
    providers: [CustomerCountryResolver],
    exports: [CustomerCountryResolver],
})
export class CustomerCountryModule {}
