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
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('send mails!', args)
                resolve()
            }, 2000)
        })
    }
}
