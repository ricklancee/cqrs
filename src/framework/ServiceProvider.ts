import { Container } from 'inversify'
import { ApplicationConfig } from './App'

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

    constructor(container: Container, applicationConfig: ApplicationConfig) {
        this.container = container
        this.config = applicationConfig
    }

    public abstract register(): void | Promise<void>
}
