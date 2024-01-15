import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUserResolver } from './user-user.resolver';
import { UserAdminResolver } from './user-admin.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [UserUserResolver, UserAdminResolver, UserService],
  imports: [PrismaModule],
  exports: [UserService]
})
export class UserModule { }
