import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EmailInputDto {
    @Field(() => String)
    from: string;

    @Field(() => String)
    to: string;

    @Field(() => String, { nullable: true })
    subject: string;

    @Field(() => String, { nullable: true })
    message: string;
}

export class EmailBody {
    subject: string;
    message: string;
}
