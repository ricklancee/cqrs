import { Command } from '../../Console/Command'
import { injectable, inject } from 'inversify'
import { QueueBinding, Queue } from '../Queue'

@injectable()
export class ClearQueueCommand implements Command {
    public command = 'queue:clear'
    public description = 'Clear the entire queue'

    constructor(@inject(QueueBinding) private queue: Queue) {}

    public async handle() {
        await this.queue.clear()
    }
}
