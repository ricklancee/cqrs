import { injectable, inject, named } from 'inversify'
import { LoggerBinding, Logger } from '../Logger/Logger'
import { ReporterBinding, Reporter } from './Reporter/Reporter'

type ErrorCallback = (error: Error) => void

@injectable()
export class ExceptionHandler {
    private callbacks = new Set<ErrorCallback>()

    constructor(
        @inject(LoggerBinding) private logger: Logger,
        @inject(ReporterBinding) private reporter: Reporter
    ) {}

    public async report(error: Error): Promise<void> {
        await this.logger.error(error.stack)
        await this.reporter.reportError(error)

        for (const callback of this.callbacks) {
            await callback(error)
        }
    }

    public onError(callback: (error: Error) => void) {
        this.callbacks.add(callback)
    }
}

export const ExceptionHandlerBinding = Symbol.for('ExceptionHandlerBinding')
