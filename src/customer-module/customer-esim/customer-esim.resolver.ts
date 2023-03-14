import { CACHE_MANAGER, Inject, forwardRef } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import JSON from 'graphql-type-json';
import { ESimGoService } from 'src/modules/third-party/eSIM-go/eSimGo.service';

@Resolver()
export class CustomerESimResolver {
  constructor(
    @Inject(forwardRef(() => ESimGoService))
    private eSimGoService: ESimGoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ****************************** RESOLVER FIELD ********************************//

  @Query(() => JSON)
  async listESimAssignedForCustomer(): Promise<any> {
    return await this.eSimGoService.getListESimAssignedToYou();
  }
}
