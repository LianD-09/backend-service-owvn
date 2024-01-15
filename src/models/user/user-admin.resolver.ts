import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { UpdateUserInput } from './dto/update-user.input';
import { SetRole } from '../../auth/decorators/set-role.decorator';
import { Role } from '../../common/enums/common.enums';
import { ParseEnumPipe, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { Status } from '@prisma/client';

@Resolver(() => User)
export class UserAdminResolver {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Query(() => [User], { name: 'ListUser' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'GetOneUser' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User, { name: 'UpdateUser' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateUser(
    @Args('id') id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.update(id, updateUserInput);
  }

  @Mutation(() => User, { name: 'DeleteUser' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.remove(id);
  }

  @Mutation(() => User, { name: 'UpdateUserStatus' })
  @SetRole(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateUserStatus(
    @Args('id') id: number,
    @Args('status', new ParseEnumPipe(Status)) status: Status) {
    return await this.userService.updateStatus(id, status);
  }
}
