import { Module } from '@nestjs/common';
import { ProviderModule } from '../provider/provider.module';
import { ProviderBundleDtoResolver } from './provider-bundle.resolver';
import { ProviderBundleService } from './provider-bundle.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
    ProviderBundle,
    ProviderBundleSchema,
} from './schema/provider-bundle.schema';

@Module({
    imports: [
        ProviderModule,
        MongooseModule.forFeature([
            { name: ProviderBundle.name, schema: ProviderBundleSchema },
        ]),
    ],
    providers: [ProviderBundleService, ProviderBundleDtoResolver],
    exports: [ProviderBundleService, ProviderBundleDtoResolver],
})
export class ProviderBundleModule {}
