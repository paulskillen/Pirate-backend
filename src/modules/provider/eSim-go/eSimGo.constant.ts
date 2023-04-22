import { registerEnumType } from '@nestjs/graphql';
import * as dotenv from 'dotenv';

dotenv.config();

export const ESIM_GO_CACHE_TTL = 600;
export const ESIM_GO_BUNDLES_CACHE_TTL = 6000;
export const ESIM_GO_PREFIX_CODE = 'ESG';
export const ESIM_GO_CACHE_KEY = '{esim_go_cache_key}:';
export const ESIM_GO_BUNDLES_CACHE_KEY = `${ESIM_GO_CACHE_KEY}_Bundles_All`;

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
