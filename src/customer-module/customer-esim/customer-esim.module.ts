import { forwardRef, Module } from '@nestjs/common';
import { ESimGoModule } from 'src/modules/provider/eSim-go/eSimGo.module';
import { CustomerESimResolver } from './customer-esim.resolver';

@Module({
    imports: [ESimGoModule],
    providers: [CustomerESimResolver],
    exports: [CustomerESimResolver],
})
export class CustomerESimModule {}
