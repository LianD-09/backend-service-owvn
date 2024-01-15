import { registerEnumType } from "@nestjs/graphql";
import { Gender, Status } from "@prisma/client";

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export const registerEnumGlobal = () => {
    registerEnumType(Gender, { name: 'Gender' });
    registerEnumType(Status, { name: 'Status' });
    registerEnumType(Role, { name: 'Role' });
}