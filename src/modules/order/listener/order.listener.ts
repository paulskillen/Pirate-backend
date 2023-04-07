import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderStatus } from '../order.constant';
import { EVENT_ORDER } from '../order.event';
import { OrderService } from '../order.service';
import { Order } from '../schema/order.schema';

@Injectable()
export class OrderListener {
    constructor(
        private eventEmitter: EventEmitter2,
        private readonly orderService: OrderService,
    ) {}

    // ****************************** UTIL METHOD ********************************//

    // ****************************** BOOKING EVENTS ********************************//

    @OnEvent(EVENT_ORDER.GENERATE, { async: true })
    async listenerOrderGeneratedEvent(payload: {
        auth: any;
        data: Order;
        input?: any;
    }): Promise<boolean> {
        const { auth, data } = payload || {};
        if (data?.status === OrderStatus.ORDER_GENERATED && data?.refOrder) {
            await this.orderService.complete(data);
        }
        return true;
    }
}
