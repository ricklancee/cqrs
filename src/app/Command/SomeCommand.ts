import { Command } from '../../framework/Console/Command'
import { injectable } from 'inversify'

@injectable()
export class SomeCommand implements Command {
    public command = 'foo <some>'
    public description = 'some foo stuff'

    public handle(...args: any[]) {
        console.log('ha')
    }
}
