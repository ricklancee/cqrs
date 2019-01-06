import { HttpKernel } from '../framework/Http/HttpKernel'
import { injectable } from 'inversify'
import { GraphQLMiddlewareBinding } from '../framework/GraphQL/GraphQLMiddleware'

@injectable()
export class Kernel extends HttpKernel {
    protected middleware: symbol[] = [GraphQLMiddlewareBinding]
}
