import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class AdminLoginRequest {
    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: false })
    password: string;

    @Field(() => String, { nullable: true })
    authenticator: string;
}

@ObjectType()
export class AdminLoginResponse {
    @Field(() => Boolean, { nullable: false })
    verified: boolean;

    @Field(() => String, { nullable: true })
    accessToken: string;
}
