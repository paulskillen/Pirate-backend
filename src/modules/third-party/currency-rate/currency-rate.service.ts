import { HttpService } from '@nestjs/axios';
import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom } from 'rxjs';
import { ErrorInternalException } from 'src/common/errors/errors.constant';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    CURRENCY_RATE_CACHE_KEY,
    CURRENCY_RATE_CACHE_TTL,
    exchangeRateApi,
} from './currency-rate.constant';

@Injectable()
export class CurrencyRateService implements OnModuleInit {
    private readonly logger = new Logger(CurrencyRateService.name);
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
        private httpService: HttpService,
    ) {}

    currencyRateCache = new AppCacheServiceManager(
        this.cacheManager,
        CURRENCY_RATE_CACHE_KEY,
        CURRENCY_RATE_CACHE_TTL,
    );

    async onModuleInit() {
        await this.fetchCurrencyRate();
    }

    async findByIds() {
        return true;
    }

    // ****************************** UTIL METHOD ********************************//

    // ****************************** BUNDLES ********************************//

    async fetchCurrencyRate(): Promise<any> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(exchangeRateApi(), {
                        headers: {},
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw ErrorInternalException(error?.message);
                        }),
                    ),
            );
            console.log(
                '🚀 >>>>>> file: currency-rate.service.ts:55 >>>>>> ESimGoService >>>>>> getCurrencyRate >>>>>> data:',
                data,
            );

            const rates = data?.conversion_rates;
            if (rates) {
                await this.currencyRateCache.set(data, {
                    key: CURRENCY_RATE_CACHE_KEY,
                    useStringify: false,
                });
            }
        } catch (error) {
            this.logger.error({ error });
        }
    }

    async getCurrencyRate(): Promise<any> {
        return await this.currencyRateCache.get(CURRENCY_RATE_CACHE_KEY);
    }
}
