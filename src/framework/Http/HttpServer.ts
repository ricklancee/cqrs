export interface HttpServerOptions {
    port: number
}

export const HttpServerBinding = Symbol.for('HttpServerBinding')
export const HttpServerOptionsBinding = Symbol.for('HttpServerOptionsBinding')

export type StartCallback = (addres: string) => void

export interface HttpServer {
    register: (middleware: Function) => void

    use: (path: string, middleware: Function) => void
    get: (path: string, middleware: Function) => void
    post: (path: string, middleware: Function) => void
    put: (path: string, middleware: Function) => void
    delete: (path: string, middleware: Function) => void

    start: (callback: StartCallback) => Promise<void>
}
