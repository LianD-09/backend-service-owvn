import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { BaseException } from '../common/filters/exception.filter';

@Controller('confirm')
export class ConfirmController {
    constructor(
        private readonly confirmService: ConfirmService
    ) { }

    @Post()
    async confirmEmailRequest(
        @Param('token') token: string
    ) {
        const payload = await this.confirmService.decodeConfirmationToken(token);
        if (!payload) {
            throw new BaseException({
                message: 'Confirm url invalid',
                statusCode: HttpStatus.NOT_FOUND
            })
        }
    }
}
