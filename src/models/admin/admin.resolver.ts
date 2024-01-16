import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './admin.model';
import { UpdateAdminInput } from './dto/update-admin.input';
import { SetRole } from '../../auth/decorators/set-role.decorator';
import { Role } from '../../common/enums/common.enums';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { BaseException } from '../../common/filters/exception.filter';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) { }

  @Query(() => [Admin], { name: 'ListAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async findAll() {
    return await this.adminService.findAll();
  }

  @Query(() => Admin, { name: 'GetOneAdmin', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.adminService.findOne(id);
  }

  @Mutation(() => Admin, { name: 'UpdateAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateAdmin(
    @Args('id') id: number,
    @Args('updateAdminInput') updateAdminInput: UpdateAdminInput
  ) {
    try {
      const adminExist = await this.adminService.findOne(id);

      if (!adminExist) {
        throw new BaseException({
          message: 'Admin does not exist',
          statusCode: HttpStatus.NOT_MODIFIED
        })
      }
      return await this.adminService.update(id, updateAdminInput);
    }
    catch (e) {
      return e;
    }
  }

  @Mutation(() => Admin, { name: 'DeleteAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async removeAdmin(@Args('id', { type: () => Int }) id: number) {
    try {
      const adminExist = await this.adminService.findOne(id);

      if (!adminExist) {
        throw new BaseException({
          message: 'Admin does not exist',
          statusCode: HttpStatus.NOT_MODIFIED
        })
      }
      return await this.adminService.remove(id);
    }
    catch (e) {
      return e;
    }
  }
}
