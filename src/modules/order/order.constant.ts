import { registerEnumType } from '@nestjs/graphql';

export const ORDER_CACHE_KEY = '{order}:';
export const ORDER_CACHE_TTL = 600;

export const ORDER_PREFIX_CODE = 'ON';

export enum OrderStatus {
    ACTIVE = 'ACTIVE',
    IN_ACTIVE = 'IN_ACTIVE',
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});

export enum OrderStockAdjustmentStatus {
    ALLOW = 'ALLOW',
    NOT_ALLOW = 'NOT_ALLOW',
}

registerEnumType(OrderStockAdjustmentStatus, {
    name: 'OrderStockAdjustmentStatus',
});
