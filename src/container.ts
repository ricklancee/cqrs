import { Container } from 'inversify'

export interface ProvidesService {
    register(): void | Promise<void>
}

interface NewableServiceProvider {
    new (container: Container): ServiceProvider
}

export abstract class ServiceProvider implements ProvidesService {
    protected container: Container

    constructor(container: Container) {
        this.container = container
    }

    public abstract register(): void | Promise<void>
}

export const container = new Container()

const registerProviders = async (providers: ProvidesService[]) => {
    for (const provider of providers) {
        console.log(`Registering "${provider.constructor.name}"...`)
        await provider.register()
        console.log(`"${provider.constructor.name}" registered`)
    }
}

export const bootstrapContainer = async (
    providers: NewableServiceProvider[]
) => {
    await registerProviders(providers.map(provider => new provider(container)))
}
