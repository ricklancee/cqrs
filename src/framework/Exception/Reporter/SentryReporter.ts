import { injectable, inject } from 'inversify'
import { Reporter } from './Reporter'
import * as Sentry from '@sentry/node'
import { ApplicationConfigBinding, ApplicationConfig } from '../../App'

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
        @inject(SentryReporterOptionsBinding) options: SentryReporterOptions,
        @inject(ApplicationConfigBinding) appConfig: ApplicationConfig
    ) {
        Sentry.init({
            environment: appConfig.env,
            ...options,
        })
    }

    public async reportError(error: Error) {
        await Sentry.withScope(async scope => {
            await Sentry.captureException(error)
        })
    }

    public async reportMessage(message: string) {
        await Sentry.withScope(async scope => {
            await Sentry.captureMessage(message)
        })
    }
}
