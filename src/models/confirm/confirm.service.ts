import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadEmail } from '../../common/models/jwt-payload.model';

@Injectable()
export class ConfirmService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async generateEmailConfirmToken(payload: JwtPayloadEmail) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.AUTH_JWT_SECRET,
        })

        return token;
    }

    async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: process.env.AUTH_JWT_SECRET,
            });

            return payload as JwtPayloadEmail;
        }
        catch (e) {
            return null;
        }

    }
}
