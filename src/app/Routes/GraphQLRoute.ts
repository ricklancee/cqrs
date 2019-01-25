import { GraphQLHTTPRoute } from '../../framework/Http/Routes/GraphQLHTTPRoute'
import { injectable } from 'inversify'
import { typeDefs, resolvers } from '../graphql'
import { Request } from 'express'

@injectable()
export class GraphQLRoute extends GraphQLHTTPRoute {
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
