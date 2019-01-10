import { ServiceProvider } from '../ServiceProvider'
import { ExceptionHandler, ExceptionHandlerBinding } from './ExceptionHandler'

export class ExceptionServiceProvider extends ServiceProvider {
    register() {
        this.container
            .bind<ExceptionHandler>(ExceptionHandlerBinding)
            .to(ExceptionHandler)
            .inSingletonScope()
    }
}
