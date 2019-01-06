import { AppError } from '../framework/AppError'

export const typeDefs = `
  type Query {
    hello: String
    expectedError: String
    reportedError: String
  }
`

// The root provides a resolver function for each API endpoint
export const resolvers = {
    Query: {
        hello: () => {
            return 'Hello world!'
        },
        expectedError: () => {
            throw new AppError('Error!', 'NOT_VALID')
        },
        reportedError: () => {
            throw new Error('Should be masked!')
        },
    },
}
