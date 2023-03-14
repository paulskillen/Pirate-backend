import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { AppCacheServiceManager } from 'src/setting/cache/app-cache.service';
import {
  ESimGoApiHeader,
  ESIM_GO_CACHE_KEY,
  ESIM_GO_CACHE_TTL,
} from './eSimGo.constant';
import { AppHelper } from 'src/common/helper/app.helper';
import { LIST_ESIM_ASSIGNED_TO_YOU } from './apis/eSimGo.api';

@Injectable()
export class ESimGoService {
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

  // ****************************** UTIL METHOD ********************************//

  private async getNextNo(): Promise<string> {
    return '0';
  }

  // ****************************** ESIM ********************************//

  async getListESimAssignedToYou(): Promise<any> {
    const res = await this.httpService.get(LIST_ESIM_ASSIGNED_TO_YOU, {
      headers: { ...ESimGoApiHeader },
    });
    console.log(
      '🚀 >>>>>> file: eSimGo.service.ts:41 >>>>>> eSimGoService >>>>>> getListEsimAssignedToYou >>>>>> res:',
      res,
    );
    return res;
  }

  // ****************************** MUTATE DATA ********************************//
}
