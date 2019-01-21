import { ServiceProvider } from '../ServiceProvider'
import {
    GraphQLOptionsBinding,
    GraphQLOptions,
} from './GraphQLExpressMiddleware'

export class GraphQLServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<GraphQLOptions>(GraphQLOptionsBinding)
            .toConstantValue(this.config.graphql)
    }
}
