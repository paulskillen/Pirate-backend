import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        // MongooseModule.forFeature([
        //     { name: Customer.name, schema: CustomerSchema },
        // ]),
        CacheModule.register({ isGlobal: true, max: 10000 }),
    ],
    providers: [],
    exports: [],
})
export class CountryModule {}
