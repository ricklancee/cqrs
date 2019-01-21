import { ApplicationConfig, ApplicationEnvironment } from '../framework/App'

export interface ExtendedAppConfig extends ApplicationConfig {}

export const config: Readonly<ExtendedAppConfig> = {
    env: ApplicationEnvironment.development,
    http: {
        port: 3000,
    },
    graphql: {
        pathname: '/graphql',
    },
}
