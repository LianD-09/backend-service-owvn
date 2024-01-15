import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [AdminResolver, AdminService],
  imports: [PrismaModule],
  exports: [AdminService]
})
export class AdminModule { }
