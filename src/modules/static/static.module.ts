import { Module } from '@nestjs/common';
import { StaticService } from './static.service';
import { StaticResolver } from './static.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticPage, StaticPageSchema } from './schema/static.schema';
import { AdminUserModule } from 'src/admin/admin-user/admin-user.module';

@Module({
    imports: [
        AdminUserModule,
        MongooseModule.forFeature([
            { name: StaticPage.name, schema: StaticPageSchema },
        ]),
    ],
    providers: [StaticResolver, StaticService],
    exports: [StaticService],
})
export class StaticModule {}
