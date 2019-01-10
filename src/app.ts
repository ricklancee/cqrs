import 'reflect-metadata'
import { Application, ApplicationEnvironment } from './framework/App'
import { EventEmitterServiceProvider } from './framework/EventEmitter/EventEmitterServiceProvider'
import { HttpServerServiceProvider } from './framework/Http/HttpServerServiceProvider'
import { Kernel } from './app/Kernel'
import { GraphQLServiceProvider } from './framework/GraphQL/GraphQLServiceProvider'
import { typeDefs, resolvers } from './app/graphql'
import { AppServiceProvider } from './app/AppServiceProvider'

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
    EventEmitterServiceProvider,
    GraphQLServiceProvider,
    HttpServerServiceProvider,
])

app.kernel(Kernel)

app.boot(() => {
    console.log('booted')
})

export { app }
