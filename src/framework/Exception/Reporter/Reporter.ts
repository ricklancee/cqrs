import { SentryReporterOptions } from './SentryReporter'
import { ConsoleReporterOptions } from './ConsoleReporter'

export const ReporterBinding = Symbol.for('Reporter')
export const ReporterOptionsBinding = Symbol.for('ReporterOptionsBinding')

export interface ReporterOptions {
    environment: string
    default: keyof ReporterOptions['services']
    services: {
        sentry: SentryReporterOptions
        console: ConsoleReporterOptions
    }
}

export interface Reporter {
    reportError(error: Error): Promise<void>
    reportMessage(message: string): Promise<void>
}
