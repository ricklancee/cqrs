import fastify from 'fastify'
import helmet from 'fastify-helmet'
import graphqlHTTP from 'express-graphql'
import { schema } from './graphql'

const server = fastify()

server.register(helmet)

server.get('/', async (request, reply) => {
    reply.type('application/json').code(200)
    return { hello: 'world' }
})

server.use(
    '/graphql',
    graphqlHTTP(request => ({
        schema,
        graphiql: true,
        context: {
            request,
        },
        formatError: error => {
            if (!error.extensions || !error.extensions.code) {
                error.message = 'INTERNAL_SERVER_ERROR beepboop'
            }

            return error
        },
        extensions: ({
            document,
            variables,
            operationName,
            result,
            context,
        }) => {
            return null
        },
    }))
)

export const startServer = () =>
    server.listen(3000, (err, address) => {
        if (err) throw err
        console.log(`server listening on ${address}`)
    })
