import { ServiceProvider } from '../ServiceProvider'
import {
    GraphQLBinding,
    GraphQL,
    GraphQLClient,
    GraphQLOptions,
    GraphQLOptionsBinding,
} from './GraphQL'
import {
    GraphQLMiddlewareBinding,
    GraphQLMiddleware,
} from './GraphQLMiddleware'

export class GraphQLServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<GraphQLOptions>(GraphQLOptionsBinding)
            .toConstantValue(this.config.graphql)

        this.container
            .bind(GraphQLMiddlewareBinding)
            .to(GraphQLMiddleware)
            .inSingletonScope()

        this.container
            .bind<GraphQLClient>(GraphQLBinding)
            .to(GraphQL)
            .inSingletonScope()
    }
}
