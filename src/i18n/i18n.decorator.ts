import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DEFAULT_LANGUAGE } from './i18n.constant';

export const CurrentLocalize = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const headerObject = ctx.getContext()?.req?.headers;
        return headerObject?.language ?? DEFAULT_LANGUAGE;
    },
);
