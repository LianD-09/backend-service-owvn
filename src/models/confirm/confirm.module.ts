import { Module } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ConfirmController } from './confirm.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [ConfirmService],
  controllers: [ConfirmController],
  imports: [JwtModule, PrismaModule],
  exports: [ConfirmService]
})
export class ConfirmModule { }
