import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../prisma/prisma.service';
import { hash } from 'bcryptjs';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async hashPassword(password: string) {
    return await hash(
      password,
      parseInt(process.env.AUTH_SALT),
    );
  }

  async create(dto: CreateUserInput) {
    dto.password = await this.hashPassword(dto.password);
    return await this.prismaService.user.create(
      {
        data: {
          ...dto,
          status: Status.ACTIVE,
        }
      });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.user.findFirst({ where: { id } });
  }

  async findBy(dto: Prisma.UserWhereInput) {
    return await this.prismaService.user.findFirst(
      {
        where: {
          OR: [
            {
              email: dto.email
            },
            {
              userName: dto.userName
            },
            {
              id: dto.id
            }
          ]
        }
      })
  }

  async update(id: number, dto: UpdateUserInput) {
    return await this.prismaService.user.update(
      {
        where: { id },
        data: dto
      });
  }

  async updateStatus(id: number, status: Status) {
    return await this.prismaService.user.update(
      {
        where: { id },
        data: { status }
      });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
