/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
    OrderCreateInput,
    OrderPaginateInput,
    OrderProcessInput,
    OrderUpdateInput,
} from './dto/order.input';
import { OrderDocument, Order, OrderInterface } from './schema/order.schema';
import { OrderHelper } from './order.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ORDER } from './order.event';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    OrderStatus,
    ORDER_CACHE_KEY,
    ORDER_CACHE_TTL,
    ORDER_EXPIRY_DAYS,
    ORDER_PREFIX_CODE,
} from './order.constant';
import { PaginateHelper } from 'src/common/helper/paginate.helper';
import { AppHelper } from 'src/common/helper/app.helper';
import {
    OrderContact,
    OrderCustomer,
    OrderProduct,
} from './schema/sub/order.sub-schema';
import { find, isEmpty, reduce } from 'lodash';
import { CustomerService } from '../customer/customer.service';
import { ProviderBundleService } from '../provider-bundle/provider-bundle.service';
import { Customer } from '../customer/schema/customer.schema';
import {
    ErrorBadRequest,
    ErrorNotFound,
} from 'src/common/errors/errors.constant';
import { ProviderName } from '../provider/provider.constant';
import { ESimGoService } from '../provider/eSim-go/eSimGo.service';
import { ESimGoOrderInput } from '../provider/eSim-go/dto/order/eSimGo-order.dto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectModel(Order.name)
        private orderModel: PaginateModel<OrderDocument>,

        @InjectModel(Order.name)
        private orderSoftDeleteModel: SoftDeleteModel<OrderDocument>,

        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

        private customerService: CustomerService,

        private providerBundleService: ProviderBundleService,

        private eventEmitter: EventEmitter2,

        private eSimGoService: ESimGoService,
    ) {}

    orderCache = new AppCacheServiceManager(
        this.cacheManager,
        ORDER_CACHE_KEY,
        ORDER_CACHE_TTL,
    );

    providers = [
        {
            id: ProviderName.ESIM_GO,
            service: this.eSimGoService,
            mapFunc: this.mapOrderDataToEsimGoOrderPayload,
        },
    ];

    // ****************************** VALIDATE METHOD ********************************//

    private validateProcessOrderInput(
        input: OrderProcessInput,
        order: Order,
    ): { error: boolean; message: string | null } {
        const {
            status,
            _id,
            products,
            total,
            subTotal,
            customer: orderCustomer,
        } = order;
        const { payment = [], customer } = input;
        const orderId = _id?.toString();
        if (status !== OrderStatus.PENDING_PAYMENT) {
            return {
                error: true,
                message: `Order #${orderId} with status ${status} is not valid to process!`,
            };
        }
        if (customer !== orderCustomer?._id?.toString?.()) {
            return {
                error: true,
                message: `Customer in payment  is not match order customer !`,
            };
        }
        if (isEmpty(payment)) {
            return { error: true, message: 'Payment input is empty !' };
        }
        const totalPayment = reduce(
            payment,
            (res, item, index) => res + item?.total ?? 0,
            0,
        );

        if (!totalPayment || totalPayment < subTotal) {
            return {
                error: true,
                message: `Payment total is not match order total !`,
            };
        }

        return {
            error: false,
            message: null,
        };
    }

    private async mapOrderDataToEsimGoOrderPayload(
        orderData: Order,
    ): Promise<ESimGoOrderInput> {
        const esimGoOrder: ESimGoOrderInput['Order'] = [];
        const { products } = orderData;
        for (const product of products) {
            const { id, name } = product?.product || {};
            const proQty = product?.quantity ?? 1;
            esimGoOrder.push({
                type: 'bundle',
                item: id || name,
                quantity: proQty,
            });
        }

        return {
            type: 'transaction',
            assign: true,
            Order: esimGoOrder,
        };
    }

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        const latestData = await this.orderModel
            .findOne(
                {
                    orderNo: {
                        $regex: ORDER_PREFIX_CODE,
                    },
                },
                {},
                { sort: { _id: -1 } },
            )
            .limit(1)
            .lean();
        const dateTime = moment().format('YYMMDD');
        const latestNo =
            latestData?.orderNo ?? `${ORDER_PREFIX_CODE}${dateTime}00000`;
        const nextNo = AppHelper.generateNextDataNo(
            latestNo,
            ORDER_PREFIX_CODE,
            dateTime,
        );
        return nextNo;
    }

    private async getOrderCustomer(
        customer: string | Customer,
    ): Promise<OrderCustomer | null> {
        const users = await this.customerService.getBasicCustomer(customer);
        return users;
    }

    private async getOrderSavingPayload(
        input: OrderCreateInput,
        auth: any,
    ): Promise<Partial<Order>> {
        const { products, remark, customer } = input;
        const saveData: Partial<Order> = {
            status: OrderStatus.PENDING_PAYMENT,
            remark,
            expiryDate: moment().add(ORDER_EXPIRY_DAYS, 'day').toDate(),
        } as unknown as Order;
        let total = 0;
        let subTotal = 0;
        let orderContact: Partial<OrderContact> = null;

        if (customer) {
            const customerData = await this.getOrderCustomer(customer);
            if (customerData) {
                const { firstName, lastName, phone, email, phoneCode } =
                    customerData;
                orderContact = {
                    firstName,
                    lastName,
                    phone,
                    email,
                    phoneCode,
                    hasCreateNewCustomer: false,
                };
                Object.assign(saveData, {
                    customer: customerData,
                    contact: orderContact,
                });
            }
        }

        if (products?.length > 0) {
            const orderProducts: OrderProduct[] = [];
            for (const product of products) {
                const orderPro =
                    await this.providerBundleService.getBundleFromProvider(
                        product?.id,
                        product?.provider,
                    );
                if (orderPro) {
                    orderProducts.push({
                        product: orderPro as any,
                        quantity: product?.quantity ?? 1,
                    });
                    total += (product?.quantity || 1) * (orderPro?.price || 1);
                    subTotal +=
                        (product?.quantity || 1) * (orderPro?.price || 1);
                } else throw ErrorBadRequest(`${product?.id} is not valid !`);
            }
            Object.assign(saveData, {
                products: orderProducts,
            });
        }

        if (auth?._id) {
            Object.assign(saveData, { createdByAdmin: auth._id });
        }

        Object.assign(saveData, { total, subTotal });

        return saveData;
    }

    // ****************************** QUERY DATA ********************************//

    async findAll(
        paginate: OrderPaginateInput,
        auth?: any,
        otherQuery?: any,
    ): Promise<OrderInterface> {
        const query = OrderHelper.getFilterOrderQuery({
            paginateInput: paginate,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        const res = await this.orderModel.paginate(query, paginate);
        return await PaginateHelper.getPaginationResult(res);
    }

    async findOne(condition: any, auth?: any): Promise<Order> {
        return await this.orderModel.findOne(condition);
    }

    async findById(id: string, auth?: any): Promise<Order> {
        return await this.orderModel.findById(id).exec();
    }

    async findByIds(ids: string[], auth?: any): Promise<Order[] | undefined> {
        return this.orderModel.find({ _id: { $in: ids } }).exec();
    }

    async getAllByCondition(
        paginateInput: OrderPaginateInput,
        auth?: any,
        otherQuery?: any,
    ): Promise<Order[]> {
        const query = OrderHelper.getFilterOrderQuery({
            paginateInput,
            previous: {},
        });
        if (otherQuery) {
            Object.assign(query, otherQuery);
        }
        return await this.orderModel.find(query);
    }

    // ****************************** MUTATE DATA ********************************//

    async create(input: OrderCreateInput, auth?: any): Promise<Order> {
        const { customer, products } = input || {};
        const exist = await this.orderModel.find(
            {
                status: { $in: [OrderStatus.PENDING_PAYMENT] },
                'customer._id': customer,
                'products.product.id': products?.[0]?.id,
                payment: null,
                expiryDate: { $gt: new Date() },
            },
            null,
            { sort: { _id: -1 } },
        );
        if (exist && exist?.length > 0) {
            const foundOrder = exist?.[0];
            const foundOrderUpdated = await this.orderModel.findOneAndUpdate(
                {
                    _id: foundOrder?._id,
                },
                {
                    $set: {
                        expiryDate: moment()
                            .add(ORDER_EXPIRY_DAYS, 'day')
                            .toDate(),
                    },
                },
                { new: true },
            );
            return foundOrder;
        }
        const saveData: Partial<Order> = await this.getOrderSavingPayload(
            input,
            auth,
        );
        const nextNo = await this.getNextNo();
        Object.assign(saveData, { orderNo: nextNo });
        try {
            const created = await this.orderModel.create(saveData);
            if (created) {
                this.eventEmitter.emit(EVENT_ORDER.CREATE, {
                    payload: input,
                    auth,
                    data: created,
                });
                await this.orderCache.set(created);
                return created;
            } else throw new Error();
        } catch (error) {
            throw new Error(error);
        }
    }

    async update(
        id: string,
        input: OrderUpdateInput,
        auth: any,
    ): Promise<Order> {
        try {
            const updated = await this.orderModel.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $set: { ...input } },
                { new: true },
            );
            if (updated) {
                this.eventEmitter.emit(EVENT_ORDER.UPDATE, {
                    payload: input,
                    auth,
                    data: updated,
                });
                await this.orderCache.set(updated);
                return updated;
            } else throw new Error();
        } catch (error) {
            throw new Error();
        }
    }

    async process(
        orderId: string,
        input: OrderProcessInput,
        auth?: any,
    ): Promise<Order> {
        try {
            const foundOrder = await this.orderModel.findById(orderId);
            if (!foundOrder) {
                throw ErrorNotFound(`Order #${orderId} is not found!`);
            }
            const { error, message } = await this.validateProcessOrderInput(
                input,
                foundOrder,
            );
            if (error) {
                throw ErrorBadRequest(message);
            }
            const processing = await this.orderModel.findOneAndUpdate(
                {
                    _id: new Types.ObjectId(orderId),
                },
                { $set: { status: OrderStatus.ORDER_PROCESSING } },
                { new: true },
            );
            if (processing) {
                const foundProvider = find(
                    this.providers,
                    (i) =>
                        i?.id === processing?.products?.[0]?.product?.provider,
                );
                const { service, mapFunc } = foundProvider || {};
                if (service) {
                    const createOrderPayload: any = await mapFunc(processing);
                    if (!isEmpty(createOrderPayload)) {
                        console.log(
                            '🚀 >>>>>> file: order.service.ts:410 >>>>>> OrderService >>>>>> createOrderPayload:',
                            createOrderPayload,
                        );
                        const providerOrder = await service.createOrder(
                            createOrderPayload,
                        );
                        this.logger.log(
                            '🚀 >>>>>> file: order.service.ts:415 >>>>>> OrderService >>>>>> providerOrder:',
                            providerOrder,
                        );
                    } else {
                        this.logger.error(
                            'Can not map provider order payload !',
                        );
                    }
                }

                // this.eventEmitter.emit(EVENT_ORDER.UPDATE, {
                //     payload: input,
                //     auth,
                //     data: processing,
                // });
                await this.orderCache.set(processing);
                return processing;
            } else throw new Error();
        } catch (error) {
            throw new Error();
        }
    }
}
