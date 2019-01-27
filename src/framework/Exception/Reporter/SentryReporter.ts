import { injectable, inject } from 'inversify'
import { Reporter } from './Reporter'

export interface SentryReporterOptions {
    dsn: string
    maxBreadcrumbs?: number
    debug?: boolean
    release?: string
    environment?: string
}

export const SentryReporterOptionsBinding = Symbol.for('SentryReporterOptions')

@injectable()
export class SentryReporter implements Reporter {
    constructor(
        @inject(SentryReporterOptionsBinding) options: SentryReporterOptions
    ) {
        console.log('TODO: INIT sentry with options', options)
    }

    public async reportError(error: Error) {}

    public async reportMessage(message: string) {}
}
