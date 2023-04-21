import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class CustomerAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext): any {
        const ctx = GqlExecutionContext.create(context);
        const token = ctx.getContext().req.headers.authorization;

        if (!token) {
            throw new AuthenticationError(
                'You are not allowed to access this data',
            );
        }

        return ctx.getContext().req;
    }

    handleRequest(err, currentAuth, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !currentAuth || !currentAuth?._id) {
            throw (
                err ||
                new AuthenticationError(
                    'Authentication token is wrong or expired',
                )
            );
        }

        return currentAuth;
    }
}
