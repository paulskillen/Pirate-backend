import { Module } from '@nestjs/common';
import { StaticModule } from 'src/modules/static/static.module';
import { CustomerStaticResolver } from './customer-static.resolver';

@Module({
    imports: [StaticModule],
    providers: [CustomerStaticResolver],
    exports: [StaticModule],
})
export class CustomerStaticModule {}
