/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { isPro } from 'src/common/config/app.config';

@Injectable()
export class MongoModule {
    static config() {
        const isDev = process.env.APP_ENV === 'development';
        const uri = process.env.MONGODB_URI;
        mongoose.set('debug', isDev);
        return MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                console.log({ isPro });
                return {
                    uri: configService.get<string>('MONGODB_URI'),
                    connectionFactory: (connection) => {
                        connection.plugin(require('mongoose-paginate'));
                        connection.plugin(
                            require('mongoose-aggregate-paginate-v2'),
                        );
                        return connection;
                    },
                    dbName: isPro ? 'pirate-mobile' : 'test',
                };
            },
            inject: [ConfigService],
        });
    }
}
