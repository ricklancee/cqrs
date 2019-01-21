import { ServiceProvider } from '../framework/ServiceProvider'
import { GraphQLMiddleware } from './Middleware/GraphQLMiddleware'
import { SomeCommand } from './Command/SomeCommand'

export class AppServiceProvider extends ServiceProvider {
    register() {
        this.container
            .bind<GraphQLMiddleware>(GraphQLMiddleware)
            .to(GraphQLMiddleware)
            .inSingletonScope()

        this.container.bind(SomeCommand).to(SomeCommand)
    }
}
