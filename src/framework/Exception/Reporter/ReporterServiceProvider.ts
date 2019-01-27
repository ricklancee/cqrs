import { ServiceProvider } from '../../Container/ServiceProvider'
import { ReporterOptionsBinding, ReporterBinding, Reporter } from './Reporter'
import { SentryReporter, SentryReporterOptionsBinding } from './SentryReporter'
import {
    ConsoleReporterOptionsBinding,
    ConsoleReporter,
} from './ConsoleReporter'

export class ReporterServiceProvider extends ServiceProvider {
    public register() {
        this.registerAdapters<Reporter>(
            {
                sentry: [SentryReporter, SentryReporterOptionsBinding],
                console: [ConsoleReporter, ConsoleReporterOptionsBinding],
            },
            ReporterBinding,
            ReporterOptionsBinding,
            'reporter'
        )
    }
}
