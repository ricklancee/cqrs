import { ServiceProvider } from '../framework/ServiceProvider'
import { GraphQL } from './Middleware/GraphQL'

export class AppServiceProvider extends ServiceProvider {
    register() {
        this.container
            .bind<GraphQL>(GraphQL)
            .to(GraphQL)
            .inSingletonScope()
    }
}
