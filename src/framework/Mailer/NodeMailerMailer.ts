import { injectable, inject } from 'inversify'
import * as nodemailer from 'nodemailer'
import {
    Mailer,
    MailOptions,
    MailerOptionsBinding,
    MailerOptions,
} from './Mailer'

export interface NodeMailerMailerOptions extends nodemailer.TransportOptions {}

export const NodeMailerMailerOptionsBinding = Symbol.for(
    'NodeMailerMailerOptionsBinding'
)

@injectable()
export class NodeMailerMailer implements Mailer {
    private transport: nodemailer.Transporter

    constructor(
        @inject(NodeMailerMailerOptionsBinding)
        options: NodeMailerMailerOptions,
        @inject(MailerOptionsBinding)
        mailerOptions: MailerOptions
    ) {
        const { defaults } = mailerOptions

        this.transport = nodemailer.createTransport(options, {
            subject: defaults ? defaults.subject : undefined,
            to: defaults ? this.formatAddress(defaults.to) : undefined,
            from: defaults ? this.formatAddress(defaults.from) : undefined,
            cc: defaults ? this.formatAddress(defaults.cc) : undefined,
            bcc: defaults ? this.formatAddress(defaults.bcc) : undefined,
        })
    }

    public async send(options: MailOptions) {
        await this.transport.sendMail({
            ...options,
            to: this.formatAddress(options.to),
            from: this.formatAddress(options.from),
            cc: this.formatAddress(options.cc),
            bcc: this.formatAddress(options.bcc),
        })
    }

    private formatAddress(addresses?: string | string[]): string {
        if (!addresses) {
            return undefined
        }

        if (!Array.isArray(addresses)) {
            return addresses
        }

        return addresses.join(', ')
    }
}
