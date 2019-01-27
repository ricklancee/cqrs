import { Readable } from 'stream'
import { NodeMailerMailerOptions } from './NodeMailerMailer'

export const MailerBinding = Symbol.for('MailerBinding')
export const MailerOptionsBinding = Symbol.for('MailerOptionsBinding')

export interface MailerOptions {
    adapter: keyof MailerOptions['adapters']
    defaults?: DefaultMailOptions
    adapters: {
        nodeMailer?: NodeMailerMailerOptions
        console?: object
    }
}

export interface Attachment {
    filename: string
    content: string | Buffer | Readable
    contentType?: string
    encoding?: string
    contentDisposition?: 'attachment' | 'inline'
    href?: string
    cid?: string
}

interface DefaultMailOptions {
    to: string | string[]
    from?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    subject?: string
}

export interface MailOptions extends DefaultMailOptions {
    text?: string
    html?: string
    attachments?: Attachment[]
}

export interface Mailer {
    send(options: MailOptions): Promise<void> | void
}
