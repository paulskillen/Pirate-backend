import { Module } from '@nestjs/common';
import { CustomerESimModule } from './customer-esim/customer-esim.module';

@Module({
    imports: [CustomerESimModule],
})
export class CustomerModuleModules {}
