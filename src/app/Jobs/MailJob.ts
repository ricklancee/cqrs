import { injectable } from 'inversify'
import { Job } from '../../framework/Queue/Job'

interface MailJobOptions {
    to: string
}

@injectable()
export class MailJob extends Job<MailJobOptions> {
    public static onQueue = 'mail'
    public static concurrency = 2

    public handle(args: MailJobOptions) {
        console.log('handling', args)
    }
}
