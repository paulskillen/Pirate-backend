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
                console.log(
                    '🚀 >>>>>> file: order.queue.ts:25 >>>>>> OrderQueue >>>>>> retryEffortCount:',
                    retryEffortCount,
                );
                return;
            }
            retryEffortCount++;
            Object.assign(input, { retryEffortCount });
            console.log(
                '🚀 >>>>>> file: order.queue.ts:29 >>>>>> OrderQueue >>>>>> input:',
                input,
            );
            const remove = await job.remove();
        } else {
            Object.assign(input, { retryEffortCount: 1 });
            console.log(
                '🚀 >>>>>> file: order.queue.ts:40 >>>>>> OrderQueue >>>>>> input:',
                input,
            );
        }
        const addedQueue = await this.orderQueue.add(
            QUEUE_ORDER.RETRY_SEND_EMAIL_AFTER_ORDER,
            input,
            {
                delay: 1000 * 60,
                priority: 1,
                jobId,
                removeOnComplete: true,
            },
        );
        return true;
    }
}
