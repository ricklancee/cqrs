import { AppServiceProvider } from '../app/AppServiceProvider'
import { ExceptionServiceProvider } from '../framework/Exception/ExceptionServiceProvider'
import { LoggerServiceProvider } from '../framework/Logger/LoggerServiceProvider'
import { EventEmitterServiceProvider } from '../framework/EventEmitter/EventEmitterServiceProvider'
import { GraphQLServiceProvider } from '../framework/GraphQL/GraphQLServiceProvider'
import { HttpServerServiceProvider } from '../framework/Http/HttpServerServiceProvider'

export const providers = [
    AppServiceProvider,
    ExceptionServiceProvider,
    LoggerServiceProvider,
    EventEmitterServiceProvider,
    GraphQLServiceProvider,
    HttpServerServiceProvider,
]
