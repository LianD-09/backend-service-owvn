import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Context } from './mail.entity';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    constructor(
        private readonly mailerService: MailerService,
    ) { }
    public async sendEmail(
        receivers: Array<string>,
        subject: string,
        context: Context,
    ) {
        this.mailerService
            .sendMail({
                to: receivers, // list of receivers
                subject,
                template: './create-user-admin', // name of the Handlebar template file
                context: {
                    name: context.name,
                    url: context.url
                },
            })
            .then()
            .catch((err) => {
                this.logger.debug(`Send mail error: ${JSON.stringify(err)}`);
            });
    }
}