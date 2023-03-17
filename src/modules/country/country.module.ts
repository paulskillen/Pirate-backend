import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryService } from './country.service';

@Module({
    imports: [
        // MongooseModule.forFeature([
        //     { name: Customer.name, schema: CustomerSchema },
        // ]),
        CacheModule.register({ isGlobal: true, max: 10000 }),
    ],
    providers: [CountryService],
    exports: [CountryService],
})
export class CountryModule {}
