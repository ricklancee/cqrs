import { injectable, inject } from 'inversify'
import { Job } from '../../framework/Queue/Job'
import { MailerBinding, Mailer } from '../../framework/Mailer/Mailer'

interface MailJobOptions {
    to: string
}

@injectable()
export class MailJob extends Job<MailJobOptions> {
    public static onQueue = 'mail'
    public static concurrency = 2

    constructor(@inject(MailerBinding) private mailer: Mailer) {
        super()
    }

    public async handle(args: MailJobOptions) {
        await this.mailer.send({
            to: args.to,
        })
    }
}
