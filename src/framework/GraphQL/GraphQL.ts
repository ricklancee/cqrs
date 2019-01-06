import { injectable, inject } from 'inversify'
import { GraphQLSchema } from 'graphql'
import { IResolvers, makeExecutableSchema } from 'graphql-tools'

export interface GraphQLClient {
    getSchema(): GraphQLSchema
}

export interface GraphQLOptions {
    pathname: string
    schema?: GraphQLSchema
    typeDefs?: string
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[]
}

export const GraphQLBinding = Symbol.for('GraphQLBinding')
export const GraphQLOptionsBinding = Symbol.for('GraphQLOptionsBinding')

@injectable()
export class GraphQL implements GraphQLClient {
    private schema: GraphQLSchema

    constructor(
        @inject(GraphQLOptionsBinding)
        private options: GraphQLOptions
    ) {
        this.createSchema()
    }

    public getSchema() {
        return this.schema
    }

    private createSchema() {
        if (this.schema) {
            throw new Error('Schema already created')
        }

        const { schema, resolvers, typeDefs } = this.options

        if (schema) {
            this.schema = schema
            return
        }

        if (resolvers && typeDefs) {
            this.schema = makeExecutableSchema({
                resolvers,
                typeDefs,
            })
            return
        }

        throw new Error('Failed to create graphql schema')
    }
}
