import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class AppCacheServiceManager {
  constructor(
    private cacheManager: Cache,
    private cacheKey: string,
    private cacheTtl: number, // 1:1sec,
  ) {}

  private getKeyFromData = (data: any) =>
    `${this.cacheKey}${data?._id?.toString?.()}`;

  async set(data: any, ttl?: number): Promise<boolean> {
    const keyToSet = this.getKeyFromData(data);
    await this.cacheManager.set(
      keyToSet,
      JSON.stringify(data),
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
