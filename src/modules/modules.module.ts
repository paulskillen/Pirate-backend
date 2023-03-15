import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { ESimGoModule } from './third-party/eSim-go/eSimGo.module';

@Module({
    imports: [CustomerModule, ESimGoModule],
})
export class ModulesModule {}
