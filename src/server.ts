import 'reflect-metadata'
import { Application, ApplicationEnvironment } from './framework/App'
import { EventEmitterServiceProvider } from './framework/EventEmitter/EventEmitterServiceProvider'
import { HttpServerServiceProvider } from './framework/Http/HttpServerServiceProvider'
import { startServer } from './app/http'

const app = new Application({
    env: ApplicationEnvironment.development,
    http: {
        port: 3000,
    },
})

app.register([EventEmitterServiceProvider, HttpServerServiceProvider])

// app.kernel(HttpKernel)
// app.kernel(ConsoleKernel)

app.boot(async () => {
    await startServer()
})

export { app }
