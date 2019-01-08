import { HttpMiddleware } from '../Http/HttpMiddleware'
import { injectable, inject } from 'inversify'
import {
    GraphQLBinding,
    GraphQL,
    GraphQLOptionsBinding,
    GraphQLOptions,
} from './GraphQL'
import { GraphQLError } from 'graphql'
import graphqlHTTP from 'express-graphql'
import { Request, Response } from 'express'
import {
    ExceptionHandler,
    ExceptionHandlerBinding,
} from '../ExceptionHandler/ExceptionHandler'

export const GraphQLMiddlewareBinding = Symbol.for('GraphQLMiddlewareBinding')

@injectable()
export class GraphQLMiddleware implements HttpMiddleware {
    public onRoute: string

    private graphQLHTTPMiddleware: graphqlHTTP.Middleware

    constructor(
        @inject(GraphQLOptionsBinding) private options: GraphQLOptions,
        @inject(GraphQLBinding) private graphql: GraphQL,
        @inject(ExceptionHandlerBinding)
        private expectionHandler: ExceptionHandler
    ) {
        const schema = this.graphql.getSchema()
        this.onRoute = this.options.pathname
        this.graphQLHTTPMiddleware = graphqlHTTP(request => ({
            schema,
            graphiql: true,
            context: {
                request,
            },
            formatError: (error: GraphQLError) => {
                return this.maskError(error)
            },
            extensions: async info => {
                if (info.result && info.result.errors) {
                    const errors = info.result.errors
                        .filter((error: GraphQLError) => error.originalError)
                        .filter((error: GraphQLError) => !error.extensions)
                        .map((error: GraphQLError) => error.originalError)

                    if (errors.length > 0) {
                        await this.reportErrors(errors)
                    }
                }
            },
        }))
    }

    public run(request: Request, response: Response) {
        return this.graphQLHTTPMiddleware(request, response)
    }

    private async reportErrors(errors: Error[]) {
        await Promise.all(
            errors.map(error => this.expectionHandler.report(error))
        )
    }

    private maskError(error: GraphQLError) {
        if (!error.originalError) {
            return error
        }

        // Mask any error that does not have an extension
        if (!error.extensions) {
            error.message = 'Something went wrong'
        }

        return error
    }
}
