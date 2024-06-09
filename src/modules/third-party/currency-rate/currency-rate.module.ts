import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';
import { CurrencyRateSchedule } from './currency-rate.schedule';
import { CurrencyRateResolver } from './currency-rate..resolver';

@Module({
    imports: [
        HttpModule.register({
            timeout: 30000,
            maxRedirects: 10,
        }),
    ],
    providers: [
        CurrencyRateService,
        CurrencyRateResolver,
        CurrencyRateSchedule,
    ],
    exports: [CurrencyRateService, CurrencyRateResolver],
})
export class CurrencyModule {}
