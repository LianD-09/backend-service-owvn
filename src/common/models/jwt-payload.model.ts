import { Role } from "../enums/common.enums";

export class JwtPayloadModel {
    sub: number;

    iat?: number;

    exp?: number;

    role: Role;
}

export class JwtPayloadEmail {
    userName: string;

    email: string;

    role: Role;
    
    iat?: number;

    exp?: number;
}