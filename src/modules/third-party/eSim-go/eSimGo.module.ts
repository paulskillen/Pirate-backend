import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ESimGoService } from './eSimGo.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 10,
    }),
  ],
  providers: [ESimGoService],
  exports: [ESimGoService],
})
export class ESimGoModule {}
