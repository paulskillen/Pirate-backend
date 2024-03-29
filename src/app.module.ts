import { CacheModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModuleModules } from './customer-module/customer-module.module';
import { MongoModule } from './setting/database/mongo.module';
import { GraphQlModule } from './setting/graphql/graphql.module';
import { AdminModules } from './admin/admin.module';
import { i18nModule } from './i18n/i18n.module';
import { BaseModules } from './modules/module.base';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true, max: 10000 }),
        // BullModule.forRoot({
        //     redis: {
        //         host: process.env.REDIS_HOST || 'localhost',
        //         port: parseInt(process.env.REDIS_PORT) || 6379,
        //         maxRetriesPerRequest: 100,
        //         // password: process.env.REDIS_PASSWORD,
        //     },
        // }),
        i18nModule.config(),
        MongoModule.config(),
        GraphQlModule.config(),
        EventEmitterModule.forRoot({ wildcard: true }),
        BaseModules,
        AdminModules,
        CustomerModuleModules,
    ],
})
export class AppModule {}
