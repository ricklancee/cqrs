import { injectable } from 'inversify'
import { Request, Response } from 'express'

type RequestHandler = (request: Request, response: Response) => void
export const RouterBinding = Symbol.for('RouterBinding')

@injectable()
export class Router {
    public routes = {
        GET: new Set(),
        POST: new Set(),
        PUT: new Set(),
        DELETE: new Set(),
        OPTIONS: new Set(),
        USE: new Set(),
    }

    public get(pathname: string, handler: RequestHandler) {
        this.routes.GET.add({ pathname, handler })
    }

    public post(pathname: string, handler: RequestHandler) {
        this.routes.POST.add({ pathname, handler })
    }

    public put(pathname: string, handler: RequestHandler) {
        this.routes.PUT.add({ pathname, handler })
    }

    public delete(pathname: string, handler: RequestHandler) {
        this.routes.DELETE.add({ pathname, handler })
    }

    public options(pathname: string, handler: RequestHandler) {
        this.routes.OPTIONS.add({ pathname, handler })
    }

    public use(handler: RequestHandler) {
        this.routes.USE.add({ handler })
    }
}
