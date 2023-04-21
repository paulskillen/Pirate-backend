import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerAuthGuard } from '../customer-auth.guard';

export const CurrentCustomer = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user;
    },
);

export const CustomerAuthorization = () => {
    return applyDecorators(UseGuards(CustomerAuthGuard));
};
