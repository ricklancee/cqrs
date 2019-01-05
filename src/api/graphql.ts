import { makeExecutableSchema } from 'graphql-tools'

export const typeDefs = `
  type Query {
    hello(foo: String): String
  }
`

// The root provides a resolver function for each API endpoint
const resolvers = {
    Query: {
        hello: () => {
            throw new Error('AAAAAAAAAh')
            return 'Hello world!'
        },
    },
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})
