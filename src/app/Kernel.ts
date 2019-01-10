import { HttpKernel } from '../framework/Http/HttpKernel'
import { injectable } from 'inversify'
import { SecurityHeadersMiddleware } from '../framework/Http/Middleware/SecurityHeadersMiddleware'
import { CorsMiddleware } from '../framework/Http/Middleware/CorsMiddleware'
import { Newable } from '../framework/Newable'
import { HttpMiddleware } from '../framework/Http/HttpMiddleware'
import { GraphQL } from './Middleware/GraphQL'

@injectable()
export class Kernel extends HttpKernel {
    protected middleware: Newable<HttpMiddleware>[] = [
        CorsMiddleware,
        SecurityHeadersMiddleware,
        GraphQL,
    ]

    public report(error: Error) {
        // Implement reactions on an error like logging to sentry
        console.log('Kernel error', error)
    }
}
