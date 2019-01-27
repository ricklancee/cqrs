import { ServiceProvider } from '../../Container/ServiceProvider'
import {
    ReporterOptionsBinding,
    ReporterOptions,
    ReporterBinding,
    Reporter,
} from './Reporter'
import { SentryReporter, SentryReporterOptionsBinding } from './SentryReporter'
import { Newable } from '../../Newable'
import {
    ConsoleReporterOptionsBinding,
    ConsoleReporter,
} from './ConsoleReporter'

export class ReporterServiceProvider extends ServiceProvider {
    public register() {
        const mapping: Record<string, [Newable<Reporter>, symbol]> = {
            sentry: [SentryReporter, SentryReporterOptionsBinding],
            console: [ConsoleReporter, ConsoleReporterOptionsBinding],
        }

        this.container
            .bind<ReporterOptions>(ReporterOptionsBinding)
            .toConstantValue(this.config.reporter)

        const service = this.config.reporter.services[
            this.config.reporter.default
        ]

        if (!service) {
            throw new Error(
                `No default matching reporter service found for "${
                    this.config.reporter.default
                }"`
            )
        }

        for (const [service, [Static, OptionsBinding]] of Object.entries(
            mapping
        )) {
            this.container
                .bind(OptionsBinding)
                .toConstantValue(this.config.reporter.services[service])

            const binding = this.container
                .bind<Reporter>(ReporterBinding)
                .to(Static)
                .inSingletonScope()

            if (service === this.config.reporter.default) {
                binding.whenTargetIsDefault()
            } else {
                binding.whenTargetNamed(service)
            }
        }
    }
}
