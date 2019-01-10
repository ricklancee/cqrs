import { Kernel, BootCallback } from '../Kernel'
import { injectable, inject } from 'inversify'
import { HttpServer, HttpServerBinding } from './HttpServer'
import { Request, Response, NextFunction } from 'express'
import { HttpMiddleware } from './HttpMiddleware'
import { Newable } from '../Newable'
import { Application, AppBinding } from '../App'

@injectable()
export abstract class HttpKernel extends Kernel {
    @inject(HttpServerBinding)
    private server: HttpServer

    @inject(AppBinding)
    private application: Application

    protected middleware: Newable<HttpMiddleware>[] = []

    public boot(callback: BootCallback) {
        // Register middleware into the server
        for (const Middleware of this.middleware) {
            const middleware = this.application.make<HttpMiddleware>(Middleware)
            const pathname = middleware.pathname ? middleware.pathname : '*'
            this.server.use(pathname, (req, res, next) => {
                middleware.handle(req, res, next)
            })
        }

        // This is the error handler and should be the last middleware
        this.server.use(
            async (
                err: Error,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                await this.exceptionHandler.report(err)
                res.status(500).send(':(')
            }
        )

        this.server.start(address => {
            this.logger.info(`server listening on ${address}`)
            callback()
        })
    }
}
