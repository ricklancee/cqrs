import { ServiceProvider } from '../Container/ServiceProvider'
import { MailerOptionsBinding, MailerBinding, Mailer } from './Mailer'
import {
    NodeMailerMailer,
    NodeMailerMailerOptionsBinding,
} from './NodeMailerMailer'
import { ConsoleMailer } from './ConsoleMailer'

export class MailerServiceProvider extends ServiceProvider {
    public register() {
        this.registerAdapters<Mailer>(
            {
                nodeMailer: [NodeMailerMailer, NodeMailerMailerOptionsBinding],
                console: [ConsoleMailer],
            },
            MailerBinding,
            MailerOptionsBinding,
            'mail'
        )
    }
}
