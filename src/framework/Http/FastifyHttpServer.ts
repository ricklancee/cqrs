import {
    HttpServer,
    HttpServerOptions,
    HttpServerOptionsBinding,
    StartCallback,
} from './HttpServer'
import { inject, injectable } from 'inversify'
import fastify from 'fastify'
import helmet from 'fastify-helmet'

@injectable()
export class FastifyHttpServer implements HttpServer {
    private server: fastify.FastifyInstance

    constructor(
        @inject(HttpServerOptionsBinding) private options: HttpServerOptions
    ) {
        this.server = fastify()
        this.server.register(helmet)
        this.register = this.server.register.bind(this.server)
        this.use = this.server.use.bind(this.server)
        this.get = this.server.get.bind(this.server)
        this.post = this.server.post.bind(this.server)
        this.put = this.server.put.bind(this.server)
        this.delete = this.server.delete.bind(this.server)
    }

    public register: () => void
    public use: () => void
    public get: () => void
    public post: () => void
    public put: () => void
    public delete: () => void

    public async start(callback: StartCallback) {
        this.server.listen(this.options.port, (err, address) => {
            if (err) throw err
            callback(address)
        })
    }
}
