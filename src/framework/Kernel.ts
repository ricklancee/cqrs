import { inject, injectable } from 'inversify'
import {
    ExceptionHandlerBinding,
    ExceptionHandler,
} from './Exception/ExceptionHandler'
import { LoggerBinding, Logger } from './Logger/Logger'

export const KernelBinding = Symbol.for('KernelBinding')

export type BootCallback = () => void

export interface Boots {
    boot(callback: BootCallback): void | Promise<void>
}

@injectable()
export abstract class Kernel implements Boots {
    constructor(
        @inject(LoggerBinding)
        protected logger: Logger,
        @inject(ExceptionHandlerBinding)
        protected exceptionHandler: ExceptionHandler
    ) {
        this.registerErrorEvents()
        this.registerExitEvents()
    }

    public boot(callback: BootCallback) {
        /** noop */
    }

    protected onExit(signal: string): Promise<void> | void {
        /** noop */
    }

    public report(error: Error) {}

    private async handleShutDown(signal: string) {
        this.logger.info(`Recieved [${signal}] shutting down program...`)
        await this.onExit(signal)
        process.kill(process.pid, signal)
    }

    private registerExitEvents() {
        process.once('SIGINT', () => this.handleShutDown('SIGINT'))
        process.once('SIGTERM', () => this.handleShutDown('SIGTERM'))
        process.once('SIGUSR2', () => this.handleShutDown('SIGUSR2'))
    }

    private registerErrorEvents() {
        process.on('uncaughtException', this.handleException)
        process.on('unhandledRejection', this.handleException)
        this.exceptionHandler.onError(error => this.report(error))
    }

    private handleException = async (error: Error) => {
        await this.exceptionHandler.report(error)
        process.exit()
    }
}
