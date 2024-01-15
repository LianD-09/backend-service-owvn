import { Role } from "../enums/common.enums";

export class JwtPayloadModel {
    sub: number;

    iat?: number;

    exp?: number;

    role: Role;
}

export class JwtPayloadEmail {
    username: string;

    email: string;

    role: Role;
}