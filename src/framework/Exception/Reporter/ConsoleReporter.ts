import { injectable, inject } from 'inversify'
import { Reporter } from './Reporter'

export interface ConsoleReporterOptions {
    prefix: string
}

export const ConsoleReporterOptionsBinding = Symbol.for(
    'ConsoleReporterOptions'
)

@injectable()
export class ConsoleReporter implements Reporter {
    constructor(
        @inject(ConsoleReporterOptionsBinding)
        private options: ConsoleReporterOptions
    ) {
        console.log('TODO: INIT console with options', this.options)
    }

    public async reportError(error: Error) {
        console.log(`${this.options.prefix} ${error.message} 😱`)
    }

    public async reportMessage(message: string) {}
}
