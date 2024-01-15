import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SetRole } from '../../auth/decorators/set-role.decorator';
import { Role } from '../../common/enums/common.enums';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RolesGuard } from '../../auth/guards/role.guard';

@Resolver(() => User)
export class UserUserResolver {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Query(() => User, { name: 'GetUserProfile' })
  @SetRole(Role.USER)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async getProfile(
    @CurrentUser() user: User
  ) {
    return await this.userService.findOne(user.id);
  }

  @Mutation(() => User, { name: 'UpdateProfile' })
  @SetRole(Role.USER)
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.update(user.id, updateUserInput);
  }
}
