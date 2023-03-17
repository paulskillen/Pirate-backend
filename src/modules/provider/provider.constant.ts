import { registerEnumType } from '@nestjs/graphql';

export const PROVIDER_CACHE_KEY = '{provider}:';
export const PROVIDER_CACHE_TTL = 600;

export enum ProviderName {
    ESIM_GO = 'ESIM_GO',
}
registerEnumType(ProviderName, {
    name: 'ProviderName',
});
