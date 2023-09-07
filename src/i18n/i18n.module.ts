/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Injectable()
export class i18nModule {
    static config() {
        const isDev = process.env.APP_ENV === 'development';
        const uri = process.env.MONGODB_URI;
        mongoose.set('debug', isDev);
        return I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '/'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ],
        });
    }
}
