import {
    Mailer,
    MailOptions,
    MailerOptionsBinding,
    MailerOptions,
} from './Mailer'
import { inject, injectable } from 'inversify'

import { Logger, LoggerBinding } from '../Logger/Logger'

@injectable()
export class ConsoleMailer implements Mailer {
    constructor(
        @inject(MailerOptionsBinding) private options: MailerOptions,
        @inject(LoggerBinding) private logger: Logger
    ) {}

    async send(options: MailOptions) {
        const { html, text, ...rest } = Object.assign(
            {},
            this.options.defaults,
            options
        )

        this.logger
            .info(`A mail was sent via the ConsoleMailer because mail adapter is set to "console"
========LOGGING A MAIL========
${Object.entries(rest).map(([key, value]) => `${key}: ${value}`)}${
            text ? `\n${text}` : ''
        }${html ? `\n${html}` : ''}
========LOGGING A MAIL========`)
    }
}
