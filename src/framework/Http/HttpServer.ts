import {
    ApplicationRequestHandler,
    IRouterMatcher,
} from 'express-serve-static-core'

export interface HttpServerOptions {
    port: number
    trustProxy?: boolean
}

export const HttpServerBinding = Symbol.for('HttpServerBinding')
export const HttpServerOptionsBinding = Symbol.for('HttpServerOptionsBinding')

export type StartCallback = (addres: string) => void

export interface HttpServer {
    use: ApplicationRequestHandler<this>

    get: IRouterMatcher<this>
    post: IRouterMatcher<this>
    put: IRouterMatcher<this>
    delete: IRouterMatcher<this>
    options: IRouterMatcher<this>

    start(callback: StartCallback): Promise<void> | void
}
