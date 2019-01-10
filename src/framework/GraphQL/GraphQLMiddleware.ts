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

interface Context {
    [key: string]: any
}

@injectable()
export abstract class GraphQLMiddleware implements HttpMiddleware {
    public pathname: string = '/graphql'

    private graphQLHTTPMiddleware: graphqlHTTP.Middleware

    constructor(
        @inject(GraphQLOptionsBinding) private options: GraphQLOptions,
        @inject(GraphQLBinding) private graphql: GraphQL,
        @inject(ExceptionHandlerBinding)
        private expectionHandler: ExceptionHandler
    ) {
        const schema = this.graphql.getSchema()

        this.pathname = this.options.pathname

        this.graphQLHTTPMiddleware = graphqlHTTP(request => ({
            schema,
            graphiql: true,
            context: this.setContext(request),
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

    protected setContext(request: Request): Context {
        return {
            request,
        }
    }

    public handle(request: Request, response: Response) {
        return this.graphQLHTTPMiddleware(request, response)
    }

    private async reportErrors(errors: Error[]) {
        await Promise.all(
            errors.map(error => this.expectionHandler.report(error))
        )
    }

    protected maskError(error: GraphQLError) {
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
