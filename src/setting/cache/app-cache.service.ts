import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class AppCacheServiceManager {
    constructor(
        private cacheManager: Cache,
        private cacheKey: string,
        private cacheTtl: number, // 1:1sec,
    ) {}

    private getKeyFromData = (data: any) =>
        `${this.cacheKey}${data?.id?.toString?.()}`;

    async get(key: string): Promise<any> {
        try {
            const data = await this.cacheManager.get(key);
            return data;
        } catch (error) {
            console.error({ error });
        }
    }

    async set(
        data: any,
        option?: { ttl?: number; key?: string; useStringify?: boolean },
    ): Promise<boolean> {
        const { ttl, key, useStringify = true } = option || {};
        const keyToSet = key || this.getKeyFromData(data);
        await this.cacheManager.set(
            keyToSet,
            useStringify ? JSON.stringify(data) : data,
            ttl || this.cacheTtl,
        );
        return true;
    }

    async remove(data: any): Promise<boolean> {
        const keyToDel =
            typeof data === 'string' ? data : this.getKeyFromData(data);
        await this.cacheManager.del(keyToDel);
        return true;
    }

    async reset(): Promise<boolean> {
        await this.cacheManager.reset();
        return true;
    }
}
