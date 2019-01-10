import { NextFunction, Response, Request, RequestHandler } from 'express'
import { HttpMiddleware } from '../HttpMiddleware'
import helmet from 'helmet'
import { injectable } from 'inversify'

@injectable()
export class SecurityHeadersMiddleware implements HttpMiddleware {
    private handler: RequestHandler

    constructor() {
        this.handler = helmet()
    }

    public handle(request: Request, response: Response, next: NextFunction) {
        this.handler(request, response, next)
    }
}
