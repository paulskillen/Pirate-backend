import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'lodash';
import { CustomerModuleModules } from './customer-module/customer-module.module';
import { ModulesModule } from './modules/modules.module';
import { MongoModule } from './setting/database/mongo.module';
import { GraphQlModule } from './setting/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, max: 10000 }),
    MongoModule.config(),
    GraphQlModule.config(),
    EventEmitterModule.forRoot({ wildcard: true }),
    ModulesModule,
    CustomerModuleModules,
  ],
})
export class AppModule {}
