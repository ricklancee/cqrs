import { HttpKernel } from '../framework/Http/HttpKernel'
import { injectable } from 'inversify'
import { SecurityHeadersMiddleware } from '../framework/Http/Middleware/SecurityHeadersMiddleware'
import { CorsMiddleware } from '../framework/Http/Middleware/CorsMiddleware'
import { Newable } from '../framework/Newable'
import { HttpMiddleware } from '../framework/Http/HttpMiddleware'
import { GraphQLMiddleware } from './Middleware/GraphQLMiddleware'

@injectable()
export class AppKernel extends HttpKernel {
    protected middleware: Newable<HttpMiddleware>[] = [
        CorsMiddleware,
        SecurityHeadersMiddleware,
        GraphQLMiddleware,
    ]

    protected routes = [`${__dirname}/routes`]

    public report(error: Error) {
        // Implement reactions on an error like logging to sentry
        console.log('Kernel error', error)
    }
}
