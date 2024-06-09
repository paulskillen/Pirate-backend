import { forwardRef, Module } from '@nestjs/common';
import { CountryModule } from 'src/modules/country/country.module';
import { AdminCountryResolver } from './admin-country.resolver';

@Module({
    imports: [CountryModule],
    providers: [AdminCountryResolver],
    exports: [AdminCountryResolver],
})
export class AdminCountryModule {}
