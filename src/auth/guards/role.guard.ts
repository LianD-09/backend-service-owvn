import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/common.enums';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseException } from '../../common/filters/exception.filter';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requireRoles) {
      return true;
    }
    const request = GqlExecutionContext.create(context).getContext().req;
    const userRole = request.user.role;
    
    const isAuthenticate = requireRoles.some((role) => userRole === role);
    if (isAuthenticate) {
      return true;
    } else {
      throw new BaseException({
        message: 'Request denied. You have no permission to implement this action',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
  }
}
