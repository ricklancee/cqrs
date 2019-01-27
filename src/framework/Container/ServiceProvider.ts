import { Container } from 'inversify'
import { ApplicationConfig } from '../App'
import { AutoBinder } from './AutoBinder'
import { Newable } from '../Newable'

export interface ProvidesService {
    register(): void | Promise<void>
    boot(): void | Promise<void>
}

export interface NewableServiceProvider {
    new (
        container: Container,
        applicationConfig: ApplicationConfig
    ): ServiceProvider
}

export abstract class ServiceProvider implements ProvidesService {
    protected readonly container: Container
    protected readonly config: ApplicationConfig
    protected readonly autobinder: AutoBinder

    constructor(container: Container, applicationConfig: ApplicationConfig) {
        this.container = container
        this.config = applicationConfig
        this.autobinder = new AutoBinder(this.container)
    }

    public abstract register(): void | Promise<void>

    public boot(): void | Promise<void> {
        /**
         * This is a noop.
         * This method can be implemented by the service provider
         * to execute some code before the kernel is booted.
         */
    }

    protected registerAdapters<TStatic>(
        drivers: Record<
            string,
            [Newable<TStatic>, symbol] | [Newable<TStatic>]
        >,
        mainBinding: symbol,
        optionsBinding: symbol,
        configKey: keyof ApplicationConfig
    ) {
        const config = this.config[configKey as string] as {
            adapter: string
            adapters: {
                [adapter: string]: any
            }
        }

        if (!config) {
            throw new Error(`No config found for key "${config}"`)
        }

        const defaultAdapter = config.adapter

        this.container.bind(optionsBinding).toConstantValue(config)

        for (const [adapter, [Static, AdapterOptionsBinding]] of Object.entries(
            drivers
        )) {
            // Only bind config if the adapter has any config
            if (AdapterOptionsBinding && config.adapters[adapter]) {
                this.container
                    .bind(AdapterOptionsBinding)
                    .toConstantValue(config.adapters[adapter])
            }

            const binding = this.container
                .bind(mainBinding)
                .to(Static)
                .inSingletonScope()

            if (adapter === defaultAdapter) {
                binding.whenTargetIsDefault()
            } else {
                binding.whenTargetNamed(adapter)
            }
        }
    }
}
