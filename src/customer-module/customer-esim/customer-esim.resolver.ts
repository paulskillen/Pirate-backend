import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { ESimGoService } from 'src/modules/provider/eSim-go/eSimGo.service';
import { CustomerAuthorization } from '../customer-auth/decorators/customer-auth.decorator';

@Resolver()
export class CustomerESimResolver {
    constructor(
        private eSimGoService: ESimGoService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    // ****************************** RESOLVER FIELD ********************************//

    @CustomerAuthorization()
    @Query(() => JSON)
    async listESimAssignedForCustomer(): Promise<any> {
        return await this.eSimGoService.getListESimAssignedToYou();
    }

    @CustomerAuthorization()
    @Query(() => JSON)
    async getESimQrCodeForCustomer(@Args('code') code: string): Promise<any> {
        const data = await this.eSimGoService.getESimQrCodeImgFromESimCode(
            code,
        );
        return { data };
    }

    // @CustomerAuthorization()
    @Mutation(() => Boolean)
    async sendSmsToESimForCustomer(@Args('iccid') iccid: string): Promise<any> {
        try {
            const data = await this.eSimGoService.sendSmsToAnESim(iccid);
            return true;
        } catch (error) {
            console.error({ error });
            return false;
        }
    }

    // @CustomerAuthorization()
    @Query(() => JSON)
    async getListBundlesAppliedToESimForCustomer(
        @Args('iccid') iccid: string,
    ): Promise<any> {
        try {
            const data = await this.eSimGoService.getListBundleAppliedToEsim(
                iccid,
            );
            return { data };
        } catch (error) {
            console.error({ error });
            return false;
        }
    }
}
