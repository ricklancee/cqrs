import { Kernel, BootCallback } from '../Kernel'
import { injectable, inject } from 'inversify'
import { HttpServer, HttpServerBinding } from './HttpServer'
import { HttpMiddleware, NewableHttpMiddleware } from './HttpMiddleware'
import { IoCBinding, MakeFN } from '../App'

@injectable()
export abstract class HttpKernel implements Kernel {
    constructor(
        @inject(HttpServerBinding) private server: HttpServer,
        @inject(IoCBinding) private make: MakeFN
    ) {}

    protected middleware: symbol[] = []

    public boot(callback: BootCallback) {
        console.log('Booting http kernel')

        for (const middleware of this.middleware) {
            const instance = this.make<HttpMiddleware>(middleware)
            this.server.use(instance.onRoute, instance.run.bind(instance))
        }

        this.server.start(address => {
            console.log(`server listening on ${address}`)
            callback()
        })
    }
}
