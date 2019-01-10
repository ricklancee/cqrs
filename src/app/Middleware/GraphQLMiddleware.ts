import { GraphQLExpressMiddleware } from '../../framework/GraphQL/GraphQLExpressMiddleware'
import { injectable } from 'inversify'
import { Request } from 'express'

@injectable()
export class GraphQLMiddleware extends GraphQLExpressMiddleware {
    protected setContext(request: Request) {
        return {
            request,
            someExtraContext: 'foo',
        }
    }
}
