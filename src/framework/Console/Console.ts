import { Kernel } from '../Kernel'
import { injectable, inject } from 'inversify'
import commander from 'commander'
import { Newable } from '../Newable'
import { AppBinding, Application } from '../App'
import { Command } from './Command'

@injectable()
export abstract class Console extends Kernel {
    private version: string = '0.0.1'

    protected commands: Newable<Command>[] = []

    @inject(AppBinding)
    private application: Application

    public boot() {
        commander.version(this.version)

        for (const Command of this.commands) {
            const command = this.application.make<Command>(Command)
            commander
                .command(command.command, command.description)
                .action((...args: any[]) =>
                    command.handle(args[args.length - 1])
                )
        }

        commander.parse(process.argv)

        if (!process.argv.slice(2).length) {
            commander.outputHelp()
        }

        process.exit()
    }
}
