import { NextFunction, Response, Request } from 'express'

export interface HttpMiddleware {
    pathname?: string
    handle(request: Request, response: Response, next: NextFunction): void
}
