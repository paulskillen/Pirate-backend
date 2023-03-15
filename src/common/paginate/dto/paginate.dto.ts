import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { PaginateOptions } from 'mongoose';

@ObjectType()
export class PaginateResponse {
    @Field(() => Int)
    page: number;

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    items: number;
}

@InputType()
export class PaginateRequest implements PaginateOptions {
    @Field((type) => Int, { defaultValue: 1 })
    page: number;

    @Field((type) => Int, { defaultValue: 10 })
    limit: number;

    @Field({ nullable: true })
    search: string;

    @Field(() => JSON, { nullable: true })
    sort?: any;
}
