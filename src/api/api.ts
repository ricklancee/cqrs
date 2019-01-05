import fastify from 'fastify'
import helmet from 'fastify-helmet'

const server = fastify()

server.register(helmet)

server.get('/', async (request, reply) => {
    reply.type('application/json').code(200)
    return { hello: 'world' }
})

export const startServer = () =>
    server.listen(3000, (err, address) => {
        if (err) throw err
        console.log(`server listening on ${address}`)
    })
