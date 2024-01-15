import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
    constructor() {
        super({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
            ],
            errorFormat: 'pretty',
        });
    }

    async onModuleInit(): Promise<any> {
        await this.$connect();
    }
}