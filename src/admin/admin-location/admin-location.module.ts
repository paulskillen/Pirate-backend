import { Module } from '@nestjs/common';
import { AdminCountryModule } from './admin-country/admin-country.module';

@Module({
    imports: [AdminCountryModule],
    exports: [AdminCountryModule],
})
export class AdminLocationModule {}
