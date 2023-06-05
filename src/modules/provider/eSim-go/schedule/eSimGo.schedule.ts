import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ESimGoService } from '../eSimGo.service';

@Injectable()
export class ESimGoSchedule {
    private readonly logger = new Logger(ESimGoSchedule.name);

    constructor(private readonly eSimGoService: ESimGoService) {}

    @Cron(CronExpression.EVERY_12_HOURS, {
        name: 'expiredVoucher',
        timeZone: 'Asia/Bangkok',
    })
    async getListBundlesSchedule(): Promise<void> {
        this.logger.debug('Called get list bundles from ESimGo');
        await this.eSimGoService.getListBundle();
    }
}
