import { makeExecutableSchema } from 'graphql-tools'
import { AppError } from '../framework/AppError'

export const typeDefs = `
  type Query {
    hello(foo: String): String
  }
`

// The root provides a resolver function for each API endpoint
const resolvers = {
    Query: {
        hello: () => {
            throw new AppError('bad hello', 'NOT_VALID')
            return 'Hello world!'
        },
    },
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})
