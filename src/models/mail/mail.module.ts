import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';

@Module({
    providers: [MailService],
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                secure: true,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: `"No reply" <${process.env.MAIL_USERNAME}>`,
            },
            template: {
                dir: './dist/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    exports: [MailService],
})
export class MailModule { }