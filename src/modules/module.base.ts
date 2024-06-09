import { Module } from '@nestjs/common';
import { CurrencyModule } from './third-party/currency-rate/currency-rate.module';

@Module({
    imports: [CurrencyModule],
})
export class BaseModules {}
