import { registerEnumType } from '@nestjs/graphql';
import * as dotenv from 'dotenv';

dotenv.config();
export const ESIM_GO_BUNDLE_GROUP = process.env.ESIM_GO_PACKAGES;
export const ESIM_GO_CACHE_TTL = 600;
export const ESIM_GO_BUNDLES_CACHE_TTL = 12 * 60 * 60 * 1000;
export const ESIM_GO_PREFIX_CODE = 'ESG';
export const ESIM_GO_CACHE_KEY = '{esim_go_cache_key}:';
export const ESIM_GO_BUNDLES_CACHE_KEY = `${ESIM_GO_CACHE_KEY}_Bundles_All`;
export const ESIM_GO_SUPPORTED_COUNTRIES_CACHE_KEY = `${ESIM_GO_CACHE_KEY}_Supported_Countries`;

export const ESIM_GO_API_URL = process.env.ESIM_GO_API_URL;
export const ESIM_GO_API_URL_VERSION_1 = process.env.ESIM_GO_API_URL_V1;
export const ESIM_GO_API_KEY = process.env.ESIM_GO_API_KEY;
export const ESIM_GO_API_HEADER = { 'X-API-Key': ESIM_GO_API_KEY };

export enum EsimGoOrderStatus {
    COMPLETED = 'completed',
}
registerEnumType(EsimGoOrderStatus, {
    name: 'EsimGoOrderStatus',
});

export const ESIM_GO_MOCKUP_ORDER = {
    order: [
        {
            type: 'bundle',
            item: 'esimg_1GB_7D_BE_U',
            quantity: 1,
            subTotal: 1.7,
            pricePerUnit: 1.7,
        },
    ],
    total: 1.7,
    currency: 'USD',
    status: 'completed',
    statusMessage: 'Order completed: 1 eSIMs assigned',
    orderReference: 'c7ca7c4c-c2bd-470b-b556-41f03bbb1029',
    assigned: true,
};
