import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../models/admin/admin.module';
import { UserModule } from '../models/user/user.module';
import { MailModule } from '../models/mail/mail.module';
import { ConfirmModule } from '../models/confirm/confirm.module';

@Module({
  providers: [
    AuthResolver,
    AuthService,
  ],
  imports: [
    PrismaModule,
    JwtModule,
    AdminModule,
    UserModule,
    MailModule,
    ConfirmModule,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule { }
