import { AppServiceProvider } from '../app/AppServiceProvider'
import { ExceptionServiceProvider } from '../framework/Exception/ExceptionServiceProvider'
import { LoggerServiceProvider } from '../framework/Logger/LoggerServiceProvider'
import { EventEmitterServiceProvider } from '../framework/EventEmitter/EventEmitterServiceProvider'
import { HttpServerServiceProvider } from '../framework/Http/HttpServerServiceProvider'
import { RedisServiceProvider } from '../framework/Redis/RedisServiceProvider'
import { QueueServiceProvider } from '../framework/Queue/QueueServiceProvider'

export const providers = [
    AppServiceProvider,
    ExceptionServiceProvider,
    LoggerServiceProvider,
    RedisServiceProvider,
    QueueServiceProvider,
    EventEmitterServiceProvider,
    HttpServerServiceProvider,
]
