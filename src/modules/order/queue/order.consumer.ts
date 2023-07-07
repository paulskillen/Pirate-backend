import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CustomerSendEmailAfterOrderInput } from 'src/customer-module/customer-order/dto/customer-order.input';
import { QUEUE_ORDER } from '../order.event';
import { OrderService } from '../order.service';

@Processor(QUEUE_ORDER.NAME)
export class OrderConsumer {
    constructor(private readonly orderService: OrderService) {}

    @Process(QUEUE_ORDER.RETRY_SEND_EMAIL_AFTER_ORDER)
    async retrySendEmailAfterOrderConsumer(
        job: Job<CustomerSendEmailAfterOrderInput>,
    ): Promise<boolean> {
        const { data } = job || {};
        const retried = await this.orderService.sendEmailAfterOrder(data);
        console.log(
            '🚀 >>>>>> file: order.consumer.ts:18 >>>>>> OrderConsumer >>>>>> retried:',
            retried,
        );
        return true;
    }
}
