import { injectable } from 'inversify'
import { Console } from '../framework/Console/Console'
import { TestQueueCommand } from './Command/TestQueueCommand'

@injectable()
export class ConsoleKerel extends Console {
    protected commands = [TestQueueCommand]
}
