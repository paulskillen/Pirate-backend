import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CustomerSendEmailAfterOrderInput } from 'src/customer-module/customer-order/dto/customer-order.input';
import { QUEUE_ORDER } from '../order.event';

@Injectable()
export class OrderQueue {
    constructor(
        @InjectQueue(QUEUE_ORDER.NAME)
        private readonly orderQueue: Queue,
    ) {}

    async addRetrySendEmailAfterOrder(
        input: CustomerSendEmailAfterOrderInput,
    ): Promise<boolean> {
        const { email, orderId } = input;
        const jobId = `${email}&${orderId}`;
        const job = await this.orderQueue.getJob(jobId);
        if (job) {
            let retryEffortCount = job?.data?.retryEffortCount ?? 0;
            if (retryEffortCount > 5) {
                const remove = await job.remove();
                return;
            }
            retryEffortCount++;
            Object.assign(input, { retryEffortCount });
            const remove = await job.remove();
        } else {
            Object.assign(input, { retryEffortCount: 1 });
        }
        const addedQueue = await this.orderQueue.add(
            QUEUE_ORDER.RETRY_SEND_EMAIL_AFTER_ORDER,
            input,
            {
                delay: 1000 * 10,
                priority: 1,
                jobId,
                removeOnComplete: true,
            },
        );
        return true;
    }
}
