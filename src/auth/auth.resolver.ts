import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './auth.model';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpStatus, Inject } from '@nestjs/common';
import { Role } from '../common/enums/common.enums';
import { AdminService } from '../models/admin/admin.service';
import { UserService } from '../models/user/user.service';
import { BaseException } from '../common/filters/exception.filter';
import { User } from '../models/user/user.model';
import { CreateUserInput } from '../models/user/dto/create-user.input';
import { Admin } from '../models/admin/admin.model';
import { CreateAdminInput } from '../models/admin/dto/create-admin.input';
import { Status } from '@prisma/client';
import { MailService } from '../models/mail/mail.service';
import { ConfirmService } from '../models/confirm/confirm.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheStorageType } from '../common/types/types';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly confirmService: ConfirmService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Mutation(() => Auth, { name: 'AdminLogin' })
  async loginAdmin(@Args('dto') dto: AuthDto) {
    try {
      const { password, userName } = dto;
      const adminExist = await this.prismaService.admin.findFirst({ where: { userName } })

      if (!adminExist) {
        throw new BaseException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong username or password!'
        });
      }

      const isAuthenticated = await this.authService.compareAuth(password, adminExist.password);

      const payload = { sub: adminExist.id, role: Role.ADMIN };
      const token = await this.authService.generateToken(payload);

      await this.adminService.update(adminExist.id, {
        token: token,
      });

      if (isAuthenticated) {
        return {
          token: token,
          role: Role.ADMIN,
        }
      }
      else {
        throw new BaseException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong username or password!'
        });
      }
    } catch (error) {
      return error;
    }
  }

  @Mutation(() => Auth, { name: 'UserLogin' })
  async loginUser(@Args('dto') dto: AuthDto) {
    try {
      const { password, userName } = dto;
      const userExist = await this.prismaService.user.findFirst({ where: { userName } })

      if (!userExist) {
        throw new BaseException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong username or password!'
        });
      }

      if (userExist.status === Status.LOCKED) {
        throw new BaseException({
          message: 'Account locked',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const isAuthenticated = await this.authService.compareAuth(password, userExist.password);

      const payload = { sub: userExist.id, role: Role.USER };
      const token = await this.authService.generateToken(payload);

      await this.userService.update(userExist.id, {
        token: token,
      });

      if (isAuthenticated) {
        return {
          token: token,
          role: Role.USER,
        }
      }
      else {
        throw new BaseException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong username or password!'
        });
      }
    } catch (error) {
      return error;
    }
  }

  @Mutation(() => User, { name: 'UserSignUp' })
  async userSignup(@Args('createUserInput') createUserInput: CreateUserInput) {
    const { email, userName } = createUserInput;
    const userExist = await this.userService.findBy({ email, userName });
    if (userExist) {
      throw new BaseException({
        message: 'User has already existed',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const token = await this.confirmService.generateEmailConfirmToken(
      {
        email,
        userName,
        role: Role.USER
      }
    );

    const newUser = await this.userService.create(createUserInput);
    if (newUser) {
      const context = {
        name: createUserInput.userName,
        url: `${process.env.MAIL_CONFIRM_URL}?token=${token}`
      };

      const data: CacheStorageType = {
        email: email,
        isVerified: false
      }

      await this.cacheManager.set(
        token,
        data,
        parseInt(process.env.MAIL_TOKEN_EXPIRED_TIME) * 1000
      );

      await this.mailService.sendEmail(
        [createUserInput.email],
        `Backend Service - Email confirmation`,
        context,
      );

      return newUser;
    }
  }

  @Mutation(() => Admin, { name: 'AdminSignUp' })
  async adminSignup(@Args('createAdminInput') createAdminInput: CreateAdminInput) {
    const { email, userName } = createAdminInput
    const adminExist = await this.adminService.findBy({ email, userName });
    if (adminExist) {
      throw new BaseException({
        message: 'Admin has already existed',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const token = await this.confirmService.generateEmailConfirmToken(
      {
        email,
        userName,
        role: Role.ADMIN
      }
    );

    const newAdmin = await this.adminService.create(createAdminInput);
    if (newAdmin) {
      const context = {
        name: createAdminInput.userName,
        url: `${process.env.MAIL_CONFIRM_URL}?token=${token}`
      };

      const data: CacheStorageType = {
        email: email,
        isVerified: false
      }

      await this.cacheManager.set(
        token,
        data,
        parseInt(process.env.MAIL_TOKEN_EXPIRED_TIME) * 1000
      );

      await this.mailService.sendEmail(
        [createAdminInput.email],
        `Backend Service - Email confirmation`,
        context,
      );

      return newAdmin;
    }
  }
}
