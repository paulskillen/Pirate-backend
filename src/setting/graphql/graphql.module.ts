/* eslint-disable @typescript-eslint/no-var-requires */
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import * as dotenv from 'dotenv';
import * as depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { join } from 'path';
import appCacheModule from '../cache/app-cache.module';
import { LIMIT_QUERY_COMPLEXITY, LIMIT_QUERY_DEPT } from './graphql.constant';

dotenv.config();

@Injectable()
export class GraphQlModule {
  static config() {
    const isDev = process.env.APP_ENV === 'development';
    const isPro = process.env.APP_ENV === 'production';
    return NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: !isPro,
      playground: !isPro,
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
    });
    // return NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     debug: configService.get('ENV') == 'production' ? false : true,
    //     playground: configService.get('ENV') == 'production' ? false : true,
    //     validationRules: [
    //       depthLimit(LIMIT_QUERY_DEPT),
    //       createComplexityLimitRule(LIMIT_QUERY_COMPLEXITY, {
    //         formatErrorMessage: (cost: any) =>
    //           `The cost of query exceeds the complexity limit - ${cost}/${LIMIT_QUERY_COMPLEXITY}`,
    //       }),
    //     ],
    //     context: (ctx) => {
    //       const { res, req, connection } = ctx;
    //       Object.assign(ctx, { loaders: appCacheModule() });
    //       return ctx;
    //     },
    //   }),
    //   inject: [ConfigService],
    // });
  }
}
