import { SentryReporterOptions } from './SentryReporter'
import { ConsoleReporterOptions } from './ConsoleReporter'

export const ReporterBinding = Symbol.for('ReporterBinding')
export const ReporterOptionsBinding = Symbol.for('ReporterOptionsBinding')

export interface ReporterOptions {
    adapter: keyof ReporterOptions['adapters']
    adapters: {
        sentry: SentryReporterOptions
        console: ConsoleReporterOptions
    }
}

export interface Reporter {
    reportError(error: Error): Promise<void>
    reportMessage(message: string): Promise<void>
}
