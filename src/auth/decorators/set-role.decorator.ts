import { Role } from "../../common/enums/common.enums";
import { SetMetadata } from '@nestjs/common';

export const SetRole = (...roles: Role[]) => SetMetadata('roles', roles);
