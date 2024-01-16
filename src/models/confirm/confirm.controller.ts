import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { BaseException } from '../../common/filters/exception.filter';
import { Role } from '../../common/enums/common.enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheStorageType } from '../../common/types/types';

@Controller('confirm')
export class ConfirmController {
    constructor(
        private readonly confirmService: ConfirmService,
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @Get()
    async confirmEmailRequest(
        @Query('token') token: string
    ) {
        const payload = await this.confirmService.decodeConfirmationToken(token);
        const verified = await this.cacheManager.get<CacheStorageType>(token);

        if (!payload || !verified) {
            throw new BaseException({
                message: 'Confirm url invalid',
                statusCode: HttpStatus.NOT_FOUND
            })
        }
        else if (verified.isVerified) {
            throw new BaseException({
                message: 'This email has been verified!',
                statusCode: HttpStatus.BAD_REQUEST
            })
        }
        else {
            await this.cacheManager.set(
                token,
                {
                    ...verified,
                    isVerified: true
                },
                payload.exp * 1000 - Date.now()
            )
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
