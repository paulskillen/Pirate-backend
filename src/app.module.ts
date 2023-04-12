import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModuleModules } from './customer-module/customer-module.module';
import { MongoModule } from './setting/database/mongo.module';
import { GraphQlModule } from './setting/graphql/graphql.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true, max: 10000 }),
        MongoModule.config(),
        GraphQlModule.config(),
        EventEmitterModule.forRoot({ wildcard: true }),
        CustomerModuleModules,
    ],
})
export class AppModule {}
