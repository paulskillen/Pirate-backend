/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoModule {
  static config() {
    const isDev = process.env.APP_ENV === 'development';
    const uri = process.env.MONGODB_URI;
    mongoose.set('debug', isDev);
    return MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-paginate'));
          connection.plugin(require('mongoose-aggregate-paginate-v2'));
          return connection;
        },
      }),
      inject: [ConfigService],
    });
  }
}
