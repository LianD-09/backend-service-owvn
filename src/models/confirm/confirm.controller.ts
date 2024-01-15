import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { BaseException } from '../../common/filters/exception.filter';
import { Role } from '../../common/enums/common.enums';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('confirm')
export class ConfirmController {
    constructor(
        private readonly confirmService: ConfirmService,
        private readonly prismaService: PrismaService
    ) { }

    @Get()
    async confirmEmailRequest(
        @Query('token') token: string
    ) {
        const payload = await this.confirmService.decodeConfirmationToken(token);
        if (!payload) {
            throw new BaseException({
                message: 'Confirm url invalid',
                statusCode: HttpStatus.NOT_FOUND
            })
        }

        switch (payload.role) {
            case Role.ADMIN:
                try {
                    await this.prismaService.admin.update({
                        where: {
                            email: payload.email,
                            userName: payload.userName
                        },
                        data: {
                            isVerified: true
                        }
                    })
                    return 'Verified email successfully!';
                }
                catch (e) {
                    throw new BaseException({
                        message: 'Admin account is not existed!',
                        statusCode: HttpStatus.BAD_REQUEST
                    })
                }
            case Role.USER:
                try {
                    await this.prismaService.user.update({
                        where: {
                            email: payload.email,
                            userName: payload.userName
                        },
                        data: {
                            isVerified: true
                        }
                    })
                    return 'Verified email successfully!';
                }
                catch (e) {
                    throw new BaseException({
                        message: 'User account is not existed!',
                        statusCode: HttpStatus.BAD_REQUEST
                    })
                }
            default:
                throw new BaseException(
                    {
                        message: 'Something went wrong.',
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    },
                )
        }
    }
}
