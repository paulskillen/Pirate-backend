import { Cache } from 'cache-manager';
import { find } from 'lodash';

export default class AppCacheControl<T extends { findByIds: any }> {
    constructor(
        private cacheManager: Cache,
        private service: T,
        private cacheKey: string,
        private cacheTtl: number, // 1:1sec,
    ) {}
    private getKeyFromData = (data: any) =>
        `${this.cacheKey}${data?._id?.toString?.()}`;

    async getMissingData(missingKeys: any[]) {
        const missingIds: any[] = missingKeys
            .map((key) => key.replace(this.cacheKey, ''))
            .reduce(
                (unique, key) =>
                    unique.includes(key) ? unique : [...unique, key],
                [],
            );
        let missingData: any[] = await this.service.findByIds(missingIds);

        missingData = missingKeys.map((key) => {
            const id = key.replace(this.cacheKey, '');
            return (
                missingData.find(
                    ({ _id }) => _id?.toString?.() === id?.toString?.(),
                ) || {}
            );
        });

        return missingData;
    }

    async remember(
        keys: string[],
        ttl?: number,
        callback?: (props: any) => any,
    ): Promise<any> {
        let values: any[] = await Promise.all(
            keys.map(async (key) => {
                const res = await this.cacheManager.get(key);
                return res;
            }),
        );

        values = values.map((value) => (value ? JSON.parse(value) : null));

        const missingKeys = keys.filter((_, index) => values[index] === null);

        if (missingKeys.length) {
            const missingValues = callback
                ? await callback(missingKeys)
                : await this.getMissingData(missingKeys);

            await Promise.all(
                missingKeys.map(async (key, index) => {
                    await this.set(missingValues[index], ttl);
                    return true;
                }),
            );

            // Mapping value from source back to the result
            values = values.map((value) =>
                value === null ? missingValues.shift() : value,
            );
        }

        // Convert empty value from source such as {} to be null
        values = values.map((value) => value || null);

        return values;
    }

    async set(data: any, ttl?: number): Promise<boolean> {
        const keyToSet = this.getKeyFromData(data);
        try {
            const cachedData = await this.cacheManager.set(
                keyToSet,
                JSON.stringify(data),
                ttl || this.cacheTtl,
            );
        } catch (error) {
            console.error({ error });
        }

        return true;
    }

    async remove(data: any): Promise<boolean> {
        const keyToDel =
            typeof data === 'string' ? data : this.getKeyFromData(data);
        await this.cacheManager.del(keyToDel);
        return true;
    }
}
