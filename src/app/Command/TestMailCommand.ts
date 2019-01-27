import { Command } from '../../framework/Console/Command'
import { injectable, inject } from 'inversify'
import { MailJob } from '../Jobs/MailJob'

@injectable()
export class TestMailCommand implements Command {
    public command = 'mail'
    public description = 'queue some mails'

    constructor(@inject(MailJob) private mail: MailJob) {}

    public async handle() {
        await this.mail.dispatch({ to: '1foo@foo.com' })
        await this.mail.dispatch({ to: '2bar@bar.com' })
        await this.mail.dispatch({ to: '3foo@foo.com' })
        await this.mail.dispatch({ to: '4bar@bar.com' })
        await this.mail.dispatch({ to: '5foo@foo.com' })
    }
}
