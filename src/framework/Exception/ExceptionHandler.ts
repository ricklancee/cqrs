import { injectable, inject } from 'inversify'
import { LoggerBinding, Logger } from '../Logger/Logger'

type ErrorCallback = (error: Error) => void

@injectable()
export class ExceptionHandler {
    private callbacks = new Set<ErrorCallback>()

    constructor(@inject(LoggerBinding) private logger: Logger) {}

    public async report(error: Error): Promise<void> {
        this.logger.error(error.stack)

        for (const callback of this.callbacks) {
            await callback(error)
        }
    }

    public onError(callback: (error: Error) => void) {
        this.callbacks.add(callback)
    }
}

export const ExceptionHandlerBinding = Symbol.for('ExceptionHandlerBinding')
