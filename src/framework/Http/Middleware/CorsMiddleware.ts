import { NextFunction, Response, Request, RequestHandler } from 'express'
import { HttpMiddleware } from '../HttpMiddleware'
import cors from 'cors'
import { injectable } from 'inversify'

@injectable()
export class CorsMiddleware implements HttpMiddleware {
    protected except: string[] = []
    protected allowedOrigins: string[] = []

    private cors: RequestHandler

    constructor() {
        this.cors = cors({
            origin: this.allowedOrigins,
        })
    }

    public handle(request: Request, response: Response, next: NextFunction) {
        /** Skip excluded routes */
        if (this.except.includes(request.path)) {
            next()
            return
        }

        this.cors(request, response, next)
    }
}
