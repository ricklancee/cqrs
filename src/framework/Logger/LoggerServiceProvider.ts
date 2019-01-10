import { ServiceProvider } from '../ServiceProvider'
import { Logger, LoggerBinding } from './Logger'
import { ConsoleLogger } from './ConsoleLogger'

export class LoggerServiceProvider extends ServiceProvider {
    register() {
        this.container
            .bind<Logger>(LoggerBinding)
            .to(ConsoleLogger)
            .inSingletonScope()
    }
}
