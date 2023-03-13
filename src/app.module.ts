import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModulesModule } from './modules/modules.module';
import { MongoModule } from './setting/database/mongo.module';
import { GraphQlModule } from './setting/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule.config(),
    GraphQlModule.config(),
    EventEmitterModule.forRoot({ wildcard: true }),
    ModulesModule,
  ],
})
export class AppModule {}
