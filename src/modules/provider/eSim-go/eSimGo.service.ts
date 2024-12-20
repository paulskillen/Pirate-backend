/* eslint-disable prettier/prettier */
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
import { filter, find, forEach, includes, map, some, uniqBy } from 'lodash';
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
    ESIM_GO_SEND_SMS_TO_ESIM,
} from './apis/eSimGo.api';
import {
    ESimGoApplyBundleToEsimInput,
    ESimGoOrderInput,
} from './dto/order/eSimGo-order.dto';
import {
    ESIM_GO_API_HEADER,
    ESIM_GO_BUNDLES_CACHE_KEY,
    ESIM_GO_BUNDLES_CACHE_TTL,
    ESIM_GO_BUNDLE_GROUP,
    ESIM_GO_CACHE_KEY,
    ESIM_GO_CACHE_TTL,
    ESIM_GO_MOCKUP_ORDER,
    ESIM_GO_SUPPORTED_COUNTRIES_CACHE_KEY,
} from './eSimGo.constant';
import {
    ESimGoBundle,
    ESimGoBundleCountry,
} from './schema/bundle/eSimGo-bundle.schema';
import { ESimGoEsimData } from './schema/order/eSimGo-order.schema';
import { EsimGoHelper } from './eSimGo.helper';
import { isPro } from 'src/common/config/app.config';
import { EsimGoBundlePaginateInput } from './dto/bundle/eSimGo-bundle.input';
import { PaginateHelper } from 'src/common/helper/paginate.helper';

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

    private filterEsimGoBundles(
        allData: Array<ESimGoBundle>,
        paginate: EsimGoBundlePaginateInput,
    ): any {
        const { countries: countriesSearch, search } = paginate || {};
        return filter(allData, (item) => {
            const { name, countries } = item || {};
            let isFoundName = true;
            let isFoundCountry = true;
            if (search) {
                const text = search?.toLocaleLowerCase?.();
                const countryNames = countries?.map?.((item) => item?.name);
                isFoundName =
                    name?.toLocaleLowerCase?.().indexOf(text) !== -1 ||
                    some(countryNames, (name) => {
                        return name?.toLocaleLowerCase?.().indexOf(text) !== -1;
                    });
            }
            if (countriesSearch?.length) {
                isFoundCountry = some(countries, (item) =>
                    countriesSearch.includes(item?.iso),
                );
            }
            return isFoundName && isFoundCountry;
        });
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

    async sendSmsToAnESim(
        iccid: string,
        payload?: any,
    ): Promise<ESimGoEsimData[]> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post(
                        ESIM_GO_SEND_SMS_TO_ESIM(iccid),
                        {
                            message: 'Form Pirate Mobile with love♥︎ !',
                            from: 'eSIM',
                            ...(payload || {}),
                        },
                        {
                            headers: { ...ESIM_GO_API_HEADER },
                        },
                    )
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw ErrorInternalException(error?.message);
                        }),
                    ),
            );
            return data;
        } catch (error) {
            this.logger.error('getESimDataFromOrderRef Error', {
                error,
            });
        }
    }

    // ****************************** BUNDLES ********************************//

    async findAll(
        paginate: EsimGoBundlePaginateInput,
        otherQuery?: any,
    ): Promise<any> {
        let allData: Array<any> = await this.getListBundle();
        if (paginate?.search || paginate?.countries) {
            allData = this.filterEsimGoBundles(allData, paginate);
        }
        const res = await PaginateHelper.getPaginationFromJson(
            allData,
            paginate,
        );
        return res;
    }

    async findBundleById(id: string) {
        const bundles = (await this.getListBundle()) || [];
        return find(bundles, (item) => item?.name === id);
    }

    async getListBundle(isGoldBundle = true): Promise<ESimGoBundle[]> {

        console.log('start get list bundle')

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
                            params: {
                                perPage: 100,
                                page,
                                group: ESIM_GO_BUNDLE_GROUP,
                                // groups: 'Gold eSIM Bundles',
                            },
                        })
                        .pipe(
                            catchError((error: AxiosError) => {
                                this.logger.error(error?.response?.data);
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

                const supportedCountries: Array<ESimGoBundleCountry> = [];
                forEach(allData, (item) => {
                    if (item?.countries && item?.countries?.length > 0) {
                        forEach(item?.countries ?? [], (country) => {
                            supportedCountries.push(country);
                        });
                    }
                });
                if (supportedCountries?.length > 0) {
                    const filteredCountries: Array<ESimGoBundleCountry> =
                        uniqBy(supportedCountries, (item) => item?.iso);
                    await this.eSimGoCache.set(filteredCountries, {
                        key: ESIM_GO_SUPPORTED_COUNTRIES_CACHE_KEY,
                        useStringify: true,
                        ttl: ESIM_GO_BUNDLES_CACHE_TTL,
                    });
                }
            } catch (error) {
                console.log(error)
                this.logger.error(
                    'Get list bundles from EsimGo  failed with error',
                    {
                        error,
                    },
                );
            }
        }

        let filteredData: Array<any> = [...(allData || [])];

        if (allData?.length > 0 && isGoldBundle) {
            filteredData = filter(allData, (item) =>
                EsimGoHelper.checkIsGoldBundle(item),
            );
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
            if (isPro) {
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
            } else return ESIM_GO_MOCKUP_ORDER;
        } catch (error) {
            this.logger.error('Create EsimGo order failed with error', {
                error,
            });
        }
    }
}
