import { ServiceProvider } from '../ServiceProvider'
import {
    GraphQLBinding,
    GraphQL,
    GraphQLClient,
    GraphQLOptions,
    GraphQLOptionsBinding,
} from './GraphQL'

export class GraphQLServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<GraphQLOptions>(GraphQLOptionsBinding)
            .toConstantValue(this.config.graphql)

        this.container
            .bind<GraphQLClient>(GraphQLBinding)
            .to(GraphQL)
            .inSingletonScope()
    }
}
