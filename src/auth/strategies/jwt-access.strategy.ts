import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadModel } from '../../common/models/jwt-payload.model';
import { Role } from '../../common/enums/common.enums';
import { UserService } from '../../models/user/user.service';
import { AdminService } from '../../models/admin/admin.service';
import { BaseException } from '../../common/filters/exception.filter';
import { Status } from '@prisma/client';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadModel) {
    let user: any;
    const accessToken = req.headers['authorization'].replace('Bearer ', '');
    switch (payload.role) {
      case Role.ADMIN:
        user = await this.adminService.findOne(payload.sub)

        if (accessToken !== user.token) {
          throw new BaseException({
            message: 'Authentication error. Please try again.',
            statusCode: HttpStatus.FORBIDDEN,
          });
        }

        if (!user.isVerified) {
          throw new BaseException({
            message: 'Account must be verified email first',
            statusCode: HttpStatus.FORBIDDEN,
          });
        }
        return { data: user, role: Role.ADMIN };

      case Role.USER:
        user = await this.userService.findOne(payload.sub);

        if (accessToken !== user.token) {
          throw new BaseException({
            message: 'Authentication error. Please try again.',
            statusCode: HttpStatus.FORBIDDEN,
          });
        }
        if (!user.isVerified) {
          throw new BaseException({
            message: 'Account must be verified email first',
            statusCode: HttpStatus.FORBIDDEN,
          });
        }
        if (user.status === Status.LOCKED) {
          throw new BaseException({
            message: 'Account locked.',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }

        return { data: user, role: Role.USER };

      default:
        throw new BaseException({
          message: 'This user role is not existed',
          statusCode: HttpStatus.FORBIDDEN,
        });
    }
  }
}
