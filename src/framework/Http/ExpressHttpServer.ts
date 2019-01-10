import {
    HttpServer,
    HttpServerOptions,
    HttpServerOptionsBinding,
    StartCallback,
} from './HttpServer'
import { inject, injectable } from 'inversify'
import express, { Express, IRouterMatcher } from 'express'
import { ApplicationRequestHandler } from 'express-serve-static-core'

@injectable()
export class ExpressHttpServer implements HttpServer {
    private server: Express

    constructor(
        @inject(HttpServerOptionsBinding) private options: HttpServerOptions
    ) {
        this.server = express()

        if (options.trustProxy) {
            this.server.set('trust proxy', true)
        }

        this.use = this.server.use.bind(this.server)
    }

    public use: ApplicationRequestHandler<this>

    public async start(callback: StartCallback) {
        this.server.listen(this.options.port, () => {
            callback(`http://localhost:${this.options.port}`)
        })
    }
}
