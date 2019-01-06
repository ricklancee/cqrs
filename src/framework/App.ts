import { HttpServerOptions } from './Http/HttpServer'
import { Container, interfaces } from 'inversify'
import { NewableServiceProvider, ProvidesService } from './ServiceProvider'

export const enum ApplicationEnvironment {
    development = 'DEVELOPMENT',
    production = 'PRODUCTION',
}

export interface ApplicationConfig {
    readonly env: ApplicationEnvironment
    readonly http: HttpServerOptions
}

export const ApplicationConfigBinding = Symbol.for('ApplicationConfigBinding')

export class Application {
    private readonly container: Container
    private readonly providers = new Set<ProvidesService>()

    constructor(config: ApplicationConfig) {
        this.container = new Container()

        this.container
            .bind<ApplicationConfig>(ApplicationConfigBinding)
            .toConstantValue(config)

        this.make = this.container.get.bind(this.container)
    }

    public register(providers: NewableServiceProvider[]) {
        const applicationConfig = this.container.get<ApplicationConfig>(
            ApplicationConfigBinding
        )

        providers.forEach(Provider => {
            this.providers.add(new Provider(this.container, applicationConfig))
        })
    }

    public async boot(callback: () => void) {
        for (const provider of this.providers) {
            await provider.register()
        }
        await callback()
    }

    public make: <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => T
}
