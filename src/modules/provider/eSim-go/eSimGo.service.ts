import {
    CACHE_MANAGER,
    forwardRef,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    ESIM_GO_API_HEADER,
    ESIM_GO_BUNDLES_CACHE_KEY,
    ESIM_GO_BUNDLES_CACHE_TTL,
    ESIM_GO_CACHE_KEY,
    ESIM_GO_CACHE_TTL,
} from './eSimGo.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import {
    LIST_BUNDLES,
    LIST_ESIM_ASSIGNED_TO_YOU,
    PROCESS_ORDERS,
} from './apis/eSimGo.api';
import { AxiosError } from 'axios';
import { filter, find, includes, map } from 'lodash';
import { ESimGoBundle } from './schema/bundle/eSimGo-bundle.schema';

@Injectable()
export class ESimGoService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
        private httpService: HttpService,
    ) {}

    private readonly logger = new Logger(ESimGoService.name);

    eSimGoCache = new AppCacheServiceManager(
        this.cacheManager,
        ESIM_GO_CACHE_KEY,
        ESIM_GO_CACHE_TTL,
    );

    async onModuleInit() {
        await this.getListBundle();
    }

    async findByIds() {
        return true;
    }

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    // ****************************** ESIM ********************************//

    async getListESimAssignedToYou(): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService
                .get(LIST_ESIM_ASSIGNED_TO_YOU, {
                    headers: { ...ESIM_GO_API_HEADER },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response.data);
                        throw 'An error happened!';
                    }),
                ),
        );
        return data;
    }

    // ****************************** BUNDLES ********************************//

    async findBundleById(id: string) {
        const bundles = (await this.getListBundle()) || [];
        return find(bundles, (item) => item?.name === id);
    }

    async getListBundle(): Promise<ESimGoBundle[]> {
        let page = 0;
        let pageCount = 1;
        let allData: Array<any> = await this.eSimGoCache.get(
            ESIM_GO_BUNDLES_CACHE_KEY,
        );

        if (!allData) {
            while (page <= pageCount) {
                page++;
                const { data } = await firstValueFrom(
                    this.httpService
                        .get(LIST_BUNDLES, {
                            headers: { ...ESIM_GO_API_HEADER },
                            params: { perPage: 100, page },
                        })
                        .pipe(
                            catchError((error: AxiosError) => {
                                this.logger.error(error.response.data);
                                throw 'An error happened!';
                            }),
                        ),
                );
                if (data?.pageCount) {
                    pageCount = data?.pageCount;
                }
                if (data?.bundles) {
                    allData = [...(allData || []), ...(data?.bundles ?? [])];
                }
            }
            try {
                await this.eSimGoCache.set(allData, {
                    key: ESIM_GO_BUNDLES_CACHE_KEY,
                    useStringify: false,
                    ttl: ESIM_GO_BUNDLES_CACHE_TTL,
                });
            } catch (error) {
                console.log(
                    '🚀 >>>>>> file: eSimGo.service.ts:112 >>>>>> ESimGoService >>>>>> getListBundle >>>>>> error:',
                    error,
                );
            }
        }

        return allData;
    }

    async getListBundleFromCountry(
        countryCode: string,
    ): Promise<Array<ESimGoBundle>> {
        const bundles = (await this.getListBundle()) || [];
        const data = filter(bundles, (item) =>
            includes(
                map(item?.countries ?? [], (i) => i?.iso),
                countryCode,
            ),
        );
        return data;
    }

    // ****************************** ORDERS ********************************//

    async createOrder(payload: any): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService
                .post(PROCESS_ORDERS, payload, {
                    headers: { ...ESIM_GO_API_HEADER },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response.data);
                        throw 'An error happened!';
                    }),
                ),
        );

        return data;
    }
}
