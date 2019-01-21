import { GraphQLExpressMiddleware } from '../../framework/GraphQL/GraphQLExpressMiddleware'
import { injectable } from 'inversify'
import { Request } from 'express'
import { typeDefs, resolvers } from '../graphql'

@injectable()
export class GraphQLMiddleware extends GraphQLExpressMiddleware {
    protected createSchema() {
        return {
            typeDefs,
            resolvers,
        }
    }

    protected setContext(request: Request) {
        return {
            request,
            someExtraContext: 'foo',
        }
    }
}
