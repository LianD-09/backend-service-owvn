import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './auth.model';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';
import { Role } from '../common/enums/common.enums';
import { AdminService } from '../models/admin/admin.service';
import { UserService } from '../models/user/user.service';
import { BaseException } from '../common/filters/exception.filter';
import { User } from '../models/user/user.model';
import { CreateUserInput } from '../models/user/dto/create-user.input';
import { Admin } from '../models/admin/admin.model';
import { CreateAdminInput } from '../models/admin/dto/create-admin.input';
import { Status } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly mailService: MailService
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

      const isAuthernticated = await this.authService.compareAuth(password, adminExist.password);

      const payload = { sub: adminExist.id, role: Role.ADMIN };
      const token = await this.authService.generateToken(payload);

      await this.adminService.update(adminExist.id, {
        token: token,
      });

      if (isAuthernticated) {
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
      const isAuthernticated = await this.authService.compareAuth(password, userExist.password);

      const payload = { sub: userExist.id, role: Role.USER };
      const token = await this.authService.generateToken(payload);

      await this.userService.update(userExist.id, {
        token: token,
      });

      if (isAuthernticated) {
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
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => Admin, { name: 'AdminSignUp' })
  async adminSignup(@Args('createAdminInput') createAdminInput: CreateAdminInput) {
    const token = '';
    const context = {
      name: createAdminInput.userName,
      url: `${process.env.MAIL_CONFIRM_URL}?token=${token}`
    };
    await this.mailService.sendEmail(
      [createAdminInput.email],
      `Backend Service - Email confirmation`,
      context,
    );

    return await this.adminService.create(createAdminInput);
  }
}
