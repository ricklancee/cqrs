import { injectable } from 'inversify'
import { Console } from '../framework/Console/Console'
import { SomeCommand } from './Command/SomeCommand'

@injectable()
export class ConsoleKerel extends Console {
    protected commands = [SomeCommand]
}
