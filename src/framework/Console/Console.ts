import { Kernel } from '../Kernel'
import { injectable, inject } from 'inversify'
import commander from 'commander'
import { Newable } from '../Newable'
import { AppBinding, Application } from '../App'
import { Command } from './Command'
import { ProcessQueueCommand } from '../Queue/ProcessQueueCommand'

@injectable()
export abstract class Console extends Kernel {
    private defaultCommands: Newable<Command>[] = [ProcessQueueCommand]

    protected commands: Newable<Command>[] = []

    @inject(AppBinding)
    protected application: Application

    public boot() {
        commander.version(this.application.version)

        const commands = [...this.defaultCommands, ...this.commands]

        for (const CommandStatic of commands) {
            const command = this.application.make<Command>(CommandStatic)
            commander
                .command(command.command)
                .description(command.description)
                .action(async (...args: any[]) => {
                    this.logger.debug(
                        `Running command "${CommandStatic.name}"...`
                    )

                    await command.handle()

                    if (command.keepAlive) {
                        this.logger.debug(
                            `Command "${
                                command.constructor.name
                            }" finished, but being kept alive because keepAlive option is true`
                        )
                        process.stdout.resume()
                    } else {
                        this.logger.debug(
                            `Command "${
                                command.constructor.name
                            }" ran sucessfully`
                        )
                        process.exit()
                    }
                })
        }

        commander.on('command:*', () => {
            this.logger.warn(
                `Invalid command: "${commander.args.join(
                    ' '
                )}"\nSee --help for a list of available commands.`
            )
            process.exit(0)
        })

        commander.parse(process.argv)

        if (!process.argv.slice(2).length) {
            commander.outputHelp()
            process.exit()
        }
    }
}
