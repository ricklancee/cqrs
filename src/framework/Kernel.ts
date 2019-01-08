import { inject, injectable } from 'inversify'
import {
    ExceptionHandlerBinding,
    ExceptionHandler,
} from './ExceptionHandler/ExceptionHandler'

export const KernelBinding = Symbol.for('KernelBinding')

export type BootCallback = () => void

export interface Boots {
    boot(callback: BootCallback): void | Promise<void>
}

@injectable()
export abstract class Kernel implements Boots {
    @inject(ExceptionHandlerBinding)
    private exceptionHandler: ExceptionHandler

    public boot(callback: BootCallback) {
        this.registerProcesses()
    }

    protected async report(error: Error) {
        await this.exceptionHandler.report(error)
    }

    private registerProcesses() {
        process.on('uncaughtException', async (error: Error) => {
            await this.report(error)
            process.exit()
        })
        process.on('unhandledRejection', async (error: Error) => {
            await this.report(error)
            process.exit()
        })
    }
}
