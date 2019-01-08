import { Kernel, BootCallback } from '../Kernel'
import { injectable, inject } from 'inversify'
import { HttpServer, HttpServerBinding } from './HttpServer'
import { HttpMiddleware } from './HttpMiddleware'
import { AppBinding, Application } from '../App'

@injectable()
export abstract class HttpKernel extends Kernel {
    constructor(
        @inject(HttpServerBinding) private server: HttpServer,
        @inject(AppBinding) private app: Application
    ) {
        super()
    }

    protected middleware: symbol[] = []

    public boot(callback: BootCallback) {
        console.log('Booting http kernel')

        for (const middleware of this.middleware) {
            const instance = this.app.make<HttpMiddleware>(middleware)
            this.server.use(instance.onRoute, instance.run.bind(instance))
        }

        this.server.start(address => {
            console.log(`server listening on ${address}`)
            callback()
        })
    }
}
