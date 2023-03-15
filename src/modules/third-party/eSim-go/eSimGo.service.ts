import {
    CACHE_MANAGER,
    forwardRef,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
    ESimGoApiHeader,
    ESIM_GO_CACHE_KEY,
    ESIM_GO_CACHE_TTL,
} from './eSimGo.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import { LIST_ESIM_ASSIGNED_TO_YOU } from './apis/eSimGo.api';
import { AxiosError } from 'axios';

@Injectable()
export class ESimGoService {
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

    // ****************************** UTIL METHOD ********************************//

    private async getNextNo(): Promise<string> {
        return '0';
    }

    // ****************************** ESIM ********************************//

    async getListESimAssignedToYou(): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService
                .get(LIST_ESIM_ASSIGNED_TO_YOU, {
                    headers: { ...ESimGoApiHeader },
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
    // ****************************** MUTATE DATA ********************************//
}
