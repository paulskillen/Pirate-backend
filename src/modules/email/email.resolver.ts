import { Mutation, Resolver } from '@nestjs/graphql';
import { EmailService } from './email.service';

@Resolver()
export class EmailResolver {
    constructor(private readonly emailService: EmailService) {}

    @Mutation((returns) => Boolean)
    async sendEmail(): Promise<any> {
        return await this.emailService.create({
            from: 'no-reply@jobs.dermaster.co.th',
            to: 'trung@lotusmattress.com',
            subject: 'Test Email',
            message:
                'As a result of your application for the position of {job posting title} at {company name}, we would like to invite you to attend an interview with us in order for us to get to know you better. ',
        });
    }
}
