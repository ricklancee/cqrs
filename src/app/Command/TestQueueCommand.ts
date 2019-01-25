import { Command } from '../../framework/Console/Command'
import { injectable, inject } from 'inversify'
import { QueueBinding, Queue } from '../../framework/Queue/Queue'

@injectable()
export class TestQueueCommand implements Command {
    public command = 'foo <some>'
    public description = 'some foo stuff'

    constructor(@inject(QueueBinding) private queue: Queue) {}

    public handle() {
        this.queue.queue('mail', { some: 'mail', sick: 420, payload: true })
    }
}
