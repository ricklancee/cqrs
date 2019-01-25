import { ApplicationConfig, ApplicationEnvironment } from '../framework/App'

export interface ExtendedAppConfig extends ApplicationConfig {}

export const config: Readonly<ExtendedAppConfig> = {
    env: ApplicationEnvironment.development,
    http: {
        port: 3000,
    },
    redis: {
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        password: undefined,
        db: 0,
    },
    queue: {
        queues: [
            {
                name: 'mail',
                handler: () => {
                    console.log('Got mail!')
                },
            },
        ],
    },
}
