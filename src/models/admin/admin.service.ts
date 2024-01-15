import { Injectable } from '@nestjs/common';
import { CreateAdminInput } from './dto/create-admin.input';
import { UpdateAdminInput } from './dto/update-admin.input';
import { PrismaService } from '../../prisma/prisma.service';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async hashPassword(password: string) {
    return await hash(
      password,
      parseInt(process.env.AUTH_SALT),
    );
  }

  async create(dto: CreateAdminInput) {
    dto.password = await this.hashPassword(dto.password);
    return await this.prismaService.admin.create({ data: dto })
  }

  async findAll() {
    return await this.prismaService.admin.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.admin.findFirst({ where: { id } })
  }

  async findBy(dto: Prisma.AdminWhereInput) {
    return await this.prismaService.admin.findFirst(
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

  async update(id: number, updateAdminInput: UpdateAdminInput) {
    return await this.prismaService.admin.update({ where: { id }, data: updateAdminInput })
  }

  async remove(id: number) {
    return await this.prismaService.admin.delete({ where: { id } })
  }
}
