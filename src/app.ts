import 'reflect-metadata'
import { Application, ApplicationEnvironment } from './framework/App'
import { EventEmitterServiceProvider } from './framework/EventEmitter/EventEmitterServiceProvider'
import { HttpServerServiceProvider } from './framework/Http/HttpServerServiceProvider'
import { Kernel } from './app/Kernel'
import { GraphQLServiceProvider } from './framework/GraphQL/GraphQLServiceProvider'
import { typeDefs, resolvers } from './app/graphql'
import { AppServiceProvider } from './app/AppServiceProvider'
import { ExceptionServiceProvider } from './framework/Exception/ExceptionServiceProvider'
import { LoggerServiceProvider } from './framework/Logger/LoggerServiceProvider'

const app = new Application({
    env: ApplicationEnvironment.development,
    http: {
        port: 3000,
    },
    graphql: {
        typeDefs,
        resolvers,
        pathname: '/graphql',
    },
})

app.register([
    AppServiceProvider,
    ExceptionServiceProvider,
    LoggerServiceProvider,
    EventEmitterServiceProvider,
    GraphQLServiceProvider,
    HttpServerServiceProvider,
])

app.kernel(Kernel)

app.boot(() => {
    throw new Error()
})

export { app }
