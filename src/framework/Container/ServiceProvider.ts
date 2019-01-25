import { Container } from 'inversify'
import { ApplicationConfig } from '../App'
import { AutoBinder } from './AutoBinder'

export interface ProvidesService {
    register(): void | Promise<void>
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
}
