import { GraphQLServer } from 'graphql-yoga'
import { emitter } from './alias';

const typeDefs = `
  type Query {
    test: String
  }
`

const resolvers = {
  Query: {
    test: () => {
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

export const startServer = () => {
  server.start(() => console.log('Server is running on http://localhost:4000'))
}