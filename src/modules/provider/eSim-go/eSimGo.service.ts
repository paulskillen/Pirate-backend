import { HttpService } from '@nestjs/axios';
import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { filter, find, includes, map } from 'lodash';
import { catchError, firstValueFrom } from 'rxjs';
import { ErrorInternalException } from 'src/common/errors/errors.constant';
import { Order } from 'src/modules/order/schema/order.schema';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    ESIM_GO_APPLY_BUNDLE_TO_ESIM,
    ESIM_GO_GET_ESIM_FROM_ORDER_REF,
    ESIM_GO_GET_ESIM_QR_CODE_IMG,
    ESIM_GO_LIST_BUNDLES,
    ESIM_GO_LIST_BUNDLES_APPLIED_TO_ESIM,
    ESIM_GO_LIST_ESIM_ASSIGNED_TO_YOU,
    ESIM_GO_PROCESS_ORDERS,
} from './apis/eSimGo.api';
import {
    ESimGoApplyBundleToEsimInput,
    ESimGoOrderInput,
} from './dto/order/eSimGo-order.dto';
import {
    ESIM_GO_API_HEADER,
    ESIM_GO_BUNDLES_CACHE_KEY,
    ESIM_GO_BUNDLES_CACHE_TTL,
    ESIM_GO_CACHE_KEY,
    ESIM_GO_CACHE_TTL,
} from './eSimGo.constant';
import { ESimGoBundle } from './schema/bundle/eSimGo-bundle.schema';
import { ESimGoEsimData } from './schema/order/eSimGo-order.schema';

@Injectable()
export class ESimGoService implements OnModuleInit {
    private readonly logger = new Logger(ESimGoService.name);
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private eventEmitter: EventEmitter2,
        private httpService: HttpService,
    ) {}

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
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(ESIM_GO_LIST_ESIM_ASSIGNED_TO_YOU, {
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
        } catch (error) {
            this.logger.error('getListESimAssignedToYou Error', {
                error,
            });
        }
    }

    async getESimDataFromOrderRef(
        reference: string,
    ): Promise<ESimGoEsimData[]> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(ESIM_GO_GET_ESIM_FROM_ORDER_REF, {
                        headers: {
                            ...ESIM_GO_API_HEADER,
                            Accept: 'application/json',
                        },
                        params: { reference },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw 'An error happened!';
                        }),
                    ),
            );
            this.logger.log(
                '🚀 >>>>>> file: eSimGo.service.ts:87 >>>>>> ESimGoService >>>>>> getESimDataFromOrderRef >>>>>> data:',
                data,
            );
            return data;
        } catch (error) {
            this.logger.error('getESimDataFromOrderRef Error', {
                error,
            });
        }
    }

    async getESimQrCodeImgFromESimCode(code: string): Promise<any> {
        try {
            const res = await firstValueFrom(
                this.httpService
                    .get(ESIM_GO_GET_ESIM_QR_CODE_IMG(code), {
                        headers: {
                            ...ESIM_GO_API_HEADER,
                        },
                        responseType: 'arraybuffer',
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw 'An error happened!';
                        }),
                    ),
            );

            const { data } = res || {};
            const u8 = new Uint8Array(data);
            const b64encoded = btoa(String.fromCharCode.apply(null, u8 as any));
            const base64Data = Buffer.from(data).toString('base64');
            return b64encoded;
        } catch (error) {
            this.logger.error('getESimQrCodeImgFromESimCode Error', {
                error,
            });
        }
    }

    async getESimDataForOrder(orderData: Order): Promise<ESimGoEsimData> {
        const { refOrder } = orderData;
        const esims = await this.getESimDataFromOrderRef(refOrder);
        const esimData = esims?.[0];
        const { iccid } = esimData ?? {};
        const qrCode = await this.getESimQrCodeImgFromESimCode(iccid);
        return { ...esimData, qrCode };
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
                        .get(ESIM_GO_LIST_BUNDLES, {
                            headers: { ...ESIM_GO_API_HEADER },
                            params: { perPage: 100, page },
                        })
                        .pipe(
                            catchError((error: AxiosError) => {
                                this.logger.error(error.response.data);
                                throw ErrorInternalException(error?.message);
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
                // const listJson = JSON.stringify(allData);
                // await fs.writeFileSync('src/asset/json/data.json', listJson);
                await this.eSimGoCache.set(allData, {
                    key: ESIM_GO_BUNDLES_CACHE_KEY,
                    useStringify: false,
                    ttl: ESIM_GO_BUNDLES_CACHE_TTL,
                });
            } catch (error) {
                this.logger.error(
                    'Get list bundles from EsimGo  failed with error',
                    {
                        error,
                    },
                );
            }
        }

        return allData;
    }

    async getListBundleAppliedToEsim(iccid: string): Promise<ESimGoBundle[]> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(ESIM_GO_LIST_BUNDLES_APPLIED_TO_ESIM(iccid), {
                        headers: { ...ESIM_GO_API_HEADER },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw ErrorInternalException(error?.message);
                        }),
                    ),
            );
            return data;
        } catch (error) {
            this.logger.error(
                'Get list bundle applied to eSim failed with error',
                {
                    error,
                },
            );
        }
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

    async applyBundleEsim(payload: ESimGoApplyBundleToEsimInput): Promise<any> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post(ESIM_GO_APPLY_BUNDLE_TO_ESIM, payload, {
                        headers: { ...ESIM_GO_API_HEADER },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw ErrorInternalException(error?.message);
                        }),
                    ),
            );

            return data;
        } catch (error) {
            this.logger.error('Create EsimGo order failed with error', {
                error,
            });
        }
    }

    // ****************************** ORDERS ********************************//

    async createOrder(payload: ESimGoOrderInput): Promise<any> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post(ESIM_GO_PROCESS_ORDERS, payload, {
                        headers: { ...ESIM_GO_API_HEADER },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw ErrorInternalException(error?.message);
                        }),
                    ),
            );

            return data;
        } catch (error) {
            this.logger.error('Create EsimGo order failed with error', {
                error,
            });
        }
    }
}
