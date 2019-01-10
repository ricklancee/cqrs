import { GraphQLMiddleware } from '../../framework/GraphQL/GraphQLMiddleware'
import { injectable } from 'inversify'
import { Request } from 'express'

@injectable()
export class GraphQL extends GraphQLMiddleware {
    protected setContext(request: Request) {
        return {
            request,
            someExtraContext: 'foo',
        }
    }
}
