import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ESimGoResolver } from './eSimGo.resolver';
import { ESimGoService } from './eSimGo.service';
import { ESimGoSchedule } from './schedule/eSimGo.schedule';

@Module({
    imports: [
        HttpModule.register({
            timeout: 30000,
            maxRedirects: 10,
        }),
    ],
    providers: [ESimGoService, ESimGoResolver, ESimGoSchedule],
    exports: [ESimGoService, ESimGoResolver],
})
export class ESimGoModule {}
