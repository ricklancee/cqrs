import { AppError } from '../framework/AppError'
import { User } from './User.model'
import { app } from '../bootstrap/app'
import sequelize = require('sequelize')
import { Op } from 'sequelize'

export const typeDefs = `
  type Query {
    hello: String
    expectedError: String
    reportedError: String
    createUser(email: String!, name: String!): User
    user(search: String): User
    users: [User]
    deleteUser(name: String!): Boolean
  }

  type User {
      email: String
      name: String
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
        user: (root, args) => {
            return User.find({
                where: {
                    [Op.or]: [
                        { email: { [Op.like]: `%${args.search}%` } },
                        { name: { [Op.like]: `%${args.search}%` } },
                    ],
                },
            })
        },
        users: () => User.findAll(),
        deleteUser: (root, args) =>
            User.destroy({ where: { name: args.name } }),
        createUser: async (root, args) => {
            return User.create({
                email: args.email,
                name: args.name,
            })
        },
    },
}
