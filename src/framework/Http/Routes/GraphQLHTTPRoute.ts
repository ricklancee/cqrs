import { Route } from '../Route'
import { Request, Response } from 'express'
import {
    ExceptionHandlerBinding,
    ExceptionHandler,
} from '../../Exception/ExceptionHandler'
import { inject, injectable } from 'inversify'
import graphqlHTTP from 'express-graphql'
import { IResolvers, makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema, GraphQLError } from 'graphql'
import { Context } from 'vm'

interface Options {
    schema?: GraphQLSchema
    typeDefs?: string
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[]
}

@injectable()
export abstract class GraphQLHTTPRoute implements Route {
    public pathname: string = '/graphql'

    @inject(ExceptionHandlerBinding)
    private expectionHandler: ExceptionHandler

    private graphQLHTTPMiddleware = graphqlHTTP(request => ({
        schema: this.makeSchema(this.createSchema()),
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

    public handle(request: Request, response: Response) {
        return this.graphQLHTTPMiddleware(request, response)
    }

    protected abstract createSchema(): Options

    protected setContext(request: Request): Context {
        return {
            request,
        }
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
