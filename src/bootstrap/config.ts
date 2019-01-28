import { ApplicationConfig, ApplicationEnvironment } from '../framework/App'
import { MailJob } from '../app/Jobs/MailJob'
import { ScheduledJob } from '../app/Jobs/ScheduledJob'

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
        jobs: [ScheduledJob, MailJob],
    },
    reporter: {
        adapter: 'console',
        adapters: {
            sentry: {
                dsn: 'dadada',
            },
            console: {
                prefix: '⚠️🙅‍',
            },
        },
    },
    mail: {
        adapter: 'console',
        adapters: {
            nodeMailer: {},
            console: {},
        },
    },
    database: {
        database: 'postgres',
        host: '127.0.0.1',
        username: 'postgres',
        password: 'secret',
        modelPaths: [`${__dirname}/../app/**/*.model.*`],
    },
    filesystem: {
        adapter: 'disk',
        adapters: {
            disk: {
                basePath: `${__dirname}/../storage`,
            },
        },
    },
}
