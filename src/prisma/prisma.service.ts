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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$on('query', (event: any) => {
            const queryLog = {
                query: event.query,
                duration: event.duration + ' ms',
            };
            this.logger.debug(JSON.stringify(queryLog));
        })
    }



    async onModuleInit(): Promise<any> {
        await this.$connect();
    }
}