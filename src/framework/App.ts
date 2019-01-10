import { HttpServerOptions } from './Http/HttpServer'
import { Container, injectable, interfaces } from 'inversify'
import { NewableServiceProvider, ProvidesService } from './ServiceProvider'
import { Kernel, KernelBinding } from './Kernel'
import { HttpKernel } from './Http/HttpKernel'
import { GraphQLOptions } from './GraphQL/GraphQL'
import { Logger, LoggerBinding } from './Logger/Logger'
import { ConsoleLogger } from './Logger/ConsoleLogger'
import {
    ExceptionHandler,
    ExceptionHandlerBinding,
} from './Exception/ExceptionHandler'
import { Newable } from './Newable'

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
export const AppBinding = Symbol.for('AppBinding')

type MakeFN = <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => T

@injectable()
export class Application {
    private readonly container: Container
    private readonly providers = new Set<ProvidesService>()

    constructor(config: ApplicationConfig) {
        this.container = new Container()

        this.container
            .bind<ApplicationConfig>(ApplicationConfigBinding)
            .toConstantValue(config)

        this.make = this.container.get.bind(this.container)

        this.container.bind(AppBinding).toConstantValue(this)

        this.container
            .bind<Logger>(LoggerBinding)
            .to(ConsoleLogger)
            .inSingletonScope()

        this.container
            .bind<ExceptionHandler>(ExceptionHandlerBinding)
            .to(ExceptionHandler)
            .inSingletonScope()
    }

    public register(providers: NewableServiceProvider[]) {
        const applicationConfig = this.container.get<ApplicationConfig>(
            ApplicationConfigBinding
        )

        providers.forEach(Provider => {
            this.providers.add(new Provider(this.container, applicationConfig))
        })
    }

    public make: MakeFN

    public kernel(kernel: Newable<Kernel>) {
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
