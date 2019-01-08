import { Kernel, BootCallback } from '../Kernel'
import { injectable, inject } from 'inversify'
import { HttpServer, HttpServerBinding } from './HttpServer'
import helmet from 'helmet'
import { Request, Response, NextFunction } from 'express'

@injectable()
export abstract class HttpKernel extends Kernel {
    @inject(HttpServerBinding)
    private server: HttpServer

    public boot(callback: BootCallback) {
        this.server.use(helmet())

        // This is the error handler and should be the last middleware
        this.server.use(
            async (
                err: Error,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                await this.report(err)
                res.status(500).send(':(')
            }
        )

        this.server.start(address => {
            this.logger.info(`server listening on ${address}`)
            callback()
        })
    }
}
