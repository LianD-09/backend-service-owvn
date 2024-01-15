import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadModel } from '../common/models/jwt-payload.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async hashPassword(password: string) {
        return await hash(
            password,
            parseInt(process.env.AUTH_SALT),
        );
    }

    async compareAuth(password: string, hashPassword: string) {
        return compare(password, hashPassword)
    }

    async generateToken(payload: JwtPayloadModel): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: `${0.8 * parseInt(process.env.TOKEN_EXPIRED_TIME)}s`,
            secret: process.env.AUTH_JWT_SECRET,
        });
    }

    async resetPassword(id: number, password: string) {
        const hashPassword = await this.hashPassword(password);

        return await this.prismaService.user.update({
            where: {
                id,
            },
            data: {
                password: hashPassword
            },
        });
    }
}
