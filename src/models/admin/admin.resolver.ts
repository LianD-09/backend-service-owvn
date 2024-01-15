import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './admin.model';
import { UpdateAdminInput } from './dto/update-admin.input';
import { SetRole } from '../../auth/decorators/set-role.decorator';
import { Role } from '../../common/enums/common.enums';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RolesGuard } from '../../auth/guards/role.guard';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) { }

  @Query(() => [Admin], { name: 'ListAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  findAll() {
    return this.adminService.findAll();
  }

  @Query(() => Admin, { name: 'GetOneAdmin' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findOne(id);
  }

  @Mutation(() => Admin, { name: 'UpdateAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  updateAdmin(
    @Args('id') id: number,
    @Args('updateAdminInput') updateAdminInput: UpdateAdminInput
  ) {
    return this.adminService.update(id, updateAdminInput);
  }

  @Mutation(() => Admin, { name: 'DeleteAdmin' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  removeAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.remove(id);
  }
}
