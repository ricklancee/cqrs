import { Container } from 'inversify'

export interface ProvidesService {
    register(): void | Promise<void>
}

export interface NewableServiceProvider {
    new (container: Container): ServiceProvider
}

export abstract class ServiceProvider implements ProvidesService {
    protected container: Container

    constructor(container: Container) {
        this.container = container
    }

    public abstract register(): void | Promise<void>
}

export const registerProviders = async (providers: ProvidesService[]) => {
    for (const provider of providers) {
        console.log(`Registering "${provider.constructor.name}"...`)
        await provider.register()
        console.log(`"${provider.constructor.name}" registered`)
    }
}
