import { Module } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ConfirmController } from './confirm.controller';

@Module({
  providers: [ConfirmService],
  controllers: [ConfirmController]
})
export class ConfirmModule {}
