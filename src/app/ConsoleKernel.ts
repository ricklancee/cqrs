import { injectable } from 'inversify'
import { Console } from '../framework/Console/Console'
import { TestMailCommand } from './Command/TestMailCommand'

@injectable()
export class ConsoleKerel extends Console {
    protected commands = [TestMailCommand]
}
