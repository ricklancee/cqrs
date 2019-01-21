import { HttpMiddleware } from '../Http/HttpMiddleware'
import { injectable, inject } from 'inversify'

import { GraphQLError, GraphQLSchema } from 'graphql'
import graphqlHTTP from 'express-graphql'
import { Request, Response } from 'express'
import {
    ExceptionHandler,
    ExceptionHandlerBinding,
} from '../Exception/ExceptionHandler'
import { IResolvers, makeExecutableSchema } from 'graphql-tools'

interface Context {
    [key: string]: any
}

export interface GraphQLOptions {
    pathname: string
}

interface Options {
    schema?: GraphQLSchema
    typeDefs?: string
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[]
}

export const GraphQLOptionsBinding = Symbol.for('GraphQLOptionsBinding')

@injectable()
export abstract class GraphQLExpressMiddleware implements HttpMiddleware {
    public pathname: string = '/graphql'

    private graphQLHTTPMiddleware: graphqlHTTP.Middleware
    private schema: GraphQLSchema

    constructor(
        @inject(GraphQLOptionsBinding) private options: GraphQLOptions,
        @inject(ExceptionHandlerBinding)
        private expectionHandler: ExceptionHandler
    ) {
        this.schema = this.makeSchema(this.createSchema())

        this.pathname = this.options.pathname

        this.graphQLHTTPMiddleware = graphqlHTTP(request => ({
            schema: this.schema,
            graphiql: true,
            context: this.setContext(request),
            formatError: (error: GraphQLError) => {
                if (!error.originalError) {
                    return error
                }

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

    protected abstract createSchema(): Options

    protected setContext(request: Request): Context {
        return {
            request,
        }
    }

    public handle(request: Request, response: Response) {
        this.graphQLHTTPMiddleware(request, response)
    }

    private async reportErrors(errors: Error[]) {
        await Promise.all(
            errors.map(error => this.expectionHandler.report(error))
        )
    }

    protected maskError(error: GraphQLError) {
        // Mask any error that does not have an extension
        if (!error.extensions) {
            error.message = `Something went wrong`
        }

        return error
    }

    private makeSchema(options: Options): GraphQLSchema {
        if (this.schema) {
            throw new Error('Schema already created')
        }

        const { schema, resolvers, typeDefs } = options

        if (schema) {
            return schema
        }

        if (resolvers && typeDefs) {
            return makeExecutableSchema({
                resolvers,
                typeDefs,
            })
        }

        throw new Error('Failed to create graphql schema')
    }
}
