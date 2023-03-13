/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import * as depthLimit from 'graphql-depth-limit';
import * as mongoose from 'mongoose';
import { join } from 'lodash';
import appCacheModule from '../cache/app-cache.module';
import { LIMIT_QUERY_COMPLEXITY, LIMIT_QUERY_DEPT } from './graphql.constant';

@Injectable()
export class GraphQlModule {
  static config() {
    const isDev = process.env.APP_ENV === 'development';
    return NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        debug: configService.get('ENV') == 'production' ? false : true,
        playground: configService.get('ENV') == 'production' ? false : true,
        validationRules: [
          depthLimit(LIMIT_QUERY_DEPT),
          createComplexityLimitRule(LIMIT_QUERY_COMPLEXITY, {
            formatErrorMessage: (cost: any) =>
              `The cost of query exceeds the complexity limit - ${cost}/${LIMIT_QUERY_COMPLEXITY}`,
          }),
        ],
        context: (ctx) => {
          const { res, req, connection } = ctx;
          Object.assign(ctx, { loaders: appCacheModule() });
          return ctx;
        },
        path: '/graphql',
      }),
      inject: [ConfigService],
    });
  }
}
