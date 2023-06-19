import { Injectable } from '@nestjs/common';
import { EmailInputDto } from './dto/email.dto';
import { EMAIL_DEFAULT } from './email.constant';
import emailClient from './node-ses/node-ses';

const options: any = {
    from: 'no-reply@jobs.dermaster.co.th',
    to: 'trung@lotusmattress.com',
    subject: 'Test Email',
    html: '',
    replyTo: '',
    //   cc: '',
    text: 'As a result of your application for the position of {job posting title} at {company name}, we would like to invite you to attend an interview with us in order for us to get to know you better. ',
    //   bcc: '',
    //   altText: '',
};

@Injectable()
export class EmailService {
    async create(input: EmailInputDto): Promise<boolean> {
        const { from, to, subject, message } = input;
        const res = await emailClient.sendEmail(
            {
                from: from || EMAIL_DEFAULT,
                to,
                subject,
                message,
            },
            (res) => {
                console.log({ res });
            },
        );
        console.log({ res });
        return true;
    }
}
