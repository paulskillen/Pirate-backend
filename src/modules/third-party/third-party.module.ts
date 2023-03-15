import { Module } from '@nestjs/common';
import { ESimGoModule } from './eSim-go/eSimGo.module';

@Module({
    imports: [ESimGoModule],
    exports: [ESimGoModule],
})
export class ThirdPartyModule {}
