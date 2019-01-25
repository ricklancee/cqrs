import { ServiceProvider } from '../Container/ServiceProvider'
import { QueueOptions, QueueOptionsBinding, Queue, QueueBinding } from './Queue'

export class QueueServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<QueueOptions>(QueueOptionsBinding)
            .toConstantValue(this.config.queue)

        this.container
            .bind<Queue>(QueueBinding)
            .to(Queue)
            .inSingletonScope()
    }
}
