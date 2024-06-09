import { Field, InputType } from '@nestjs/graphql';
import { Attachment } from 'nodemailer/lib/mailer';
import JSON from 'graphql-type-json';

@InputType()
export class SentEmailInput {
    @Field(() => String, { nullable: true })
    from?: string;

    @Field(() => String)
    to: string;

    @Field(() => String, { nullable: true })
    subject: string;

    @Field(() => String, { nullable: true })
    message: string;
}

@InputType()
export class SentEmailAttachmentInput extends SentEmailInput {
    @Field(() => JSON, { nullable: true })
    attachments?: Attachment[];
}

export class EmailBody {
    subject: string;
    message: string;
}
