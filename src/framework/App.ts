import { HttpServerOptions, HttpServer } from './Http/HttpServer'
import { Container, interfaces } from 'inversify'
import { NewableServiceProvider, ProvidesService } from './ServiceProvider'
import { Kernel, KernelBinding } from './Kernel'
import { HttpKernel } from './Http/HttpKernel'
import { GraphQLOptions } from './GraphQL/GraphQL'

export const enum ApplicationEnvironment {
    development = 'DEVELOPMENT',
    production = 'PRODUCTION',
}

export interface ApplicationConfig {
    readonly env: ApplicationEnvironment
    readonly http: HttpServerOptions
    readonly graphql: GraphQLOptions
}

export const ApplicationConfigBinding = Symbol.for('ApplicationConfigBinding')
export const IoCBinding = Symbol.for('IoCBinding')

export type MakeFN = <T>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
) => T

interface NewableKernel {
    new (...args: any[]): HttpKernel
}

export class Application {
    private readonly container: Container
    private readonly providers = new Set<ProvidesService>()

    constructor(config: ApplicationConfig) {
        this.container = new Container()

        this.container
            .bind<ApplicationConfig>(ApplicationConfigBinding)
            .toConstantValue(config)

        const make = this.container.get.bind(this.container)

        this.container.bind(IoCBinding).toConstantValue(make)

        this.make = make
    }

    public register(providers: NewableServiceProvider[]) {
        const applicationConfig = this.container.get<ApplicationConfig>(
            ApplicationConfigBinding
        )

        providers.forEach(Provider => {
            this.providers.add(new Provider(this.container, applicationConfig))
        })
    }

    public kernel(kernel: NewableKernel) {
        this.container
            .bind<Kernel>(KernelBinding)
            .to(kernel)
            .inSingletonScope()
    }

    public async boot(callback?: () => void) {
        for (const provider of this.providers) {
            await provider.register()
        }

        const cb = callback
            ? callback
            : () => {
                  /** noop */
                  // tslint:disable-next-line:ter-indent
              }

        await this.getKernel().boot(cb)
    }

    public make: MakeFN

    private getKernel() {
        try {
            return this.container.get<Kernel>(KernelBinding)
        } catch (err) {
            throw new Error(
                `Cannot find registered kernel class, reason:\n\t"${
                    err.message
                }"\n\tPossible solution: Has the kernel class been registered to the application?`
            )
        }
    }
}
