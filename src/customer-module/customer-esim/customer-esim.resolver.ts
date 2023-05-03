import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { ESimGoService } from 'src/modules/provider/eSim-go/eSimGo.service';

@Resolver()
export class CustomerESimResolver {
    constructor(
        private eSimGoService: ESimGoService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @Query(() => JSON)
    async listESimAssignedForCustomer(): Promise<any> {
        return await this.eSimGoService.getListESimAssignedToYou();
    }

    @Query(() => JSON)
    async getESimQrCodeForCustomer(@Args('code') code: string): Promise<any> {
        const data = await this.eSimGoService.getESimQrCodeImgFromESimCode(
            code,
        );
        return { data };
    }
}
