import { Request, Response } from 'express'

export interface HttpMiddleware {
    onRoute?: string
    run(request: Request, response: Response): void
}

export interface NewableHttpMiddleware {
    new (...args: any[]): HttpMiddleware
}
