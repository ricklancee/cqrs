import { Logger, LogMetaData } from './Logger'
import { injectable } from 'inversify'

@injectable()
export class ConsoleLogger implements Logger {
    public debug(message: string, metaData?: LogMetaData): void {
        this.logMessage('DEBUG', message, metaData)
    }

    public info(message: string, metaData?: LogMetaData): void {
        this.logMessage('INFO', message, metaData)
    }

    public warn(message: string, metaData?: LogMetaData): void {
        this.logMessage('WARN', message, metaData)
    }

    public error(message: string, metaData?: LogMetaData): void {
        this.logMessage('ERROR', message, metaData)
    }

    private logMessage(type: string, message: string, metaData?: LogMetaData) {
        const metaDataPrint = metaData ? `\n${JSON.stringify(metaData)}` : ''
        console.log(`[${type}]: ${message}${metaDataPrint}`)
    }
}
