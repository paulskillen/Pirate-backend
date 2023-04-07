import { registerEnumType } from '@nestjs/graphql';

export const ORDER_CACHE_KEY = '{order}:';
export const ORDER_CACHE_TTL = 600;

export const ORDER_PREFIX_CODE = 'ON';
export const ORDER_EXPIRY_DAYS = 7;

export enum OrderStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    ORDER_PROCESSING = 'ORDER_PROCESSING',
    ORDER_GENERATED = 'ORDER_GENERATED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}
registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});

export enum OrderPaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
}
registerEnumType(OrderPaymentStatus, {
    name: 'OrderPaymentStatus',
});

export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    CASH = 'CASH',
}
registerEnumType(PaymentMethod, {
    name: 'PaymentMethod',
});

export enum OrderType {
    TOP_UP = 'TOP_UP',
    BUY_NEW = 'BUY_NEW',
}
registerEnumType(OrderType, {
    name: 'OrderType',
});
