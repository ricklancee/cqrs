import { ServiceProvider } from '../Container/ServiceProvider'
import { QueueOptions, QueueOptionsBinding, Queue, QueueBinding } from './Queue'
import { ProcessQueueCommand } from './Commands/ProcessQueueCommand'
import { Command } from '../Console/Command'
import { ClearQueueCommand } from './Commands/ClearQueueCommand'

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

        this.container.bind<Command>(ClearQueueCommand).to(ClearQueueCommand)
    }

    public boot() {
        const queue = this.container.get<Queue>(QueueBinding)

        queue.registerQueues()

        if (this.config.queue.sync) {
            // this should not be awaited in order to keep the code running
            queue.processQueues()
        }
    }
}
