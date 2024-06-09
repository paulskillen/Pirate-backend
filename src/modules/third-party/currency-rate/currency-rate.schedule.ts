import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrencyRateService } from './currency-rate.service';

@Injectable()
export class CurrencyRateSchedule {
    private readonly logger = new Logger(CurrencyRateSchedule.name);

    constructor(private readonly currencyRateService: CurrencyRateService) {}

    @Cron(CronExpression.EVERY_12_HOURS, {
        name: 'expiredVoucher',
        timeZone: 'Asia/Bangkok',
    })
    async getListBundlesSchedule(): Promise<void> {
        this.logger.debug('Called get currency exchange rate');
        await this.currencyRateService.fetchCurrencyRate();
    }
}
