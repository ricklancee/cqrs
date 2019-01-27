import { AppError } from '../framework/AppError'
import { User } from './User.model'
import { app } from '../bootstrap/app'

export const typeDefs = `
  type Query {
    hello: String
    expectedError: String
    reportedError: String
    createUser(email: String!): User
    users: [User]
  }

  type User {
      email: String
  }
`

// The root provides a resolver function for each API endpoint
export const resolvers = {
    Query: {
        hello: (root, args, context) => {
            console.log(context)
            return 'Hello world!'
        },
        expectedError: () => {
            throw new AppError('Error!', 'NOT_VALID')
        },
        reportedError: () => {
            throw new Error('Should be masked!')
        },
        users: () => User.findAll(),
        createUser: async (root, args) => {
            return User.create({
                email: args.email,
            })
        },
    },
}
