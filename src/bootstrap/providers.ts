import { AppServiceProvider } from '../app/AppServiceProvider'
import { ExceptionServiceProvider } from '../framework/Exception/ExceptionServiceProvider'
import { LoggerServiceProvider } from '../framework/Logger/LoggerServiceProvider'
import { EventEmitterServiceProvider } from '../framework/EventEmitter/EventEmitterServiceProvider'
import { HttpServerServiceProvider } from '../framework/Http/HttpServerServiceProvider'
import { RedisServiceProvider } from '../framework/Redis/RedisServiceProvider'
import { QueueServiceProvider } from '../framework/Queue/QueueServiceProvider'
import { ReporterServiceProvider } from '../framework/Exception/Reporter/ReporterServiceProvider'
import { MailerServiceProvider } from '../framework/Mailer/MailerServiceProvider'
import { DatabaseServiceProvider } from '../framework/Database/DatabaseServiceProvider'

export const providers = [
    AppServiceProvider,
    ExceptionServiceProvider,
    LoggerServiceProvider,
    ReporterServiceProvider,
    RedisServiceProvider,
    QueueServiceProvider,
    MailerServiceProvider,
    EventEmitterServiceProvider,
    DatabaseServiceProvider,
    HttpServerServiceProvider,
]
