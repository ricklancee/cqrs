import { ServiceProvider } from '../Container/ServiceProvider'
import { QueueOptions, QueueOptionsBinding, Queue, QueueBinding } from './Queue'
import { ProcessQueueCommand } from './ProcessQueueCommand'
import { Command } from '../Console/Command'

export class QueueServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<QueueOptions>(QueueOptionsBinding)
            .toConstantValue(this.config.queue)

        this.container
            .bind<Queue>(QueueBinding)
            .to(Queue)
            .inSingletonScope()

        this.container
            .bind<Command>(ProcessQueueCommand)
            .to(ProcessQueueCommand)
    }

    public boot() {
        this.container.get<Queue>(QueueBinding).registerQueues()

        if (this.config.queue.sync) {
            this.container.get<Queue>(QueueBinding).processQueues()
        }
    }
}
