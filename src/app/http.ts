import graphqlHTTP from 'express-graphql'
import { schema } from './graphql'
import { Handler } from './Exceptions/Handler'
import { GraphQLError } from 'graphql'
import { app } from '../server'
import { HttpServer, HttpServerBinding } from '../framework/Http/HttpServer'

export const startServer = () => {
    const server = app.make<HttpServer>(HttpServerBinding)

    const errorHandler = new Handler()

    server.use(
        '/graphql',
        graphqlHTTP(request => ({
            schema,
            graphiql: true,
            context: {
                request,
            },
            formatError: error => {
                return errorHandler.formatError(error)
            },
            extensions: async info => {
                if (info.result && info.result.errors) {
                    const errors = info.result.errors
                        .filter((error: GraphQLError) => error.originalError)
                        .filter((error: GraphQLError) => !error.extensions)
                        .map((error: GraphQLError) => error.originalError)

                    if (errors.length > 0) {
                        await errorHandler.report(errors)
                    }
                }
                return null
            },
        }))
    )

    server.start(address => {
        console.log(`server listening on ${address}`)
    })
}
