import { Command } from '../../framework/Console/Command'
import { injectable, inject } from 'inversify'
import { QueueBinding, Queue } from './Queue'

@injectable()
export class ProcessQueueCommand implements Command {
    public command = 'queue:work'
    public description = 'Start processing the queue'
    public keepAlive: boolean = true

    constructor(@inject(QueueBinding) private queue: Queue) {}

    public handle() {
        this.queue.processQueues()
    }
}
