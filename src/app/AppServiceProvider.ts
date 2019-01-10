import { ServiceProvider } from '../framework/ServiceProvider'
import { GraphQLMiddleware } from './Middleware/GraphQLMiddleware'

export class AppServiceProvider extends ServiceProvider {
    register() {
        this.container
            .bind<GraphQLMiddleware>(GraphQLMiddleware)
            .to(GraphQLMiddleware)
            .inSingletonScope()
    }
}
