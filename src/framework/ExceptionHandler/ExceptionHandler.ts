import { injectable, inject } from 'inversify'
import { LoggerBinding, Logger } from '../Logger/Logger'

@injectable()
export class ExceptionHandler {
    constructor(@inject(LoggerBinding) private logger: Logger) {}

    public report(error: Error): Promise<void> | void {
        this.logger.error(error.stack)
    }
}

export const ExceptionHandlerBinding = Symbol.for('ExceptionHandlerBinding')
