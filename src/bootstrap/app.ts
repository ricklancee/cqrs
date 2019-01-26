import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { AppKernel } from '../app/AppKernel'
import { config, ExtendedAppConfig } from './config'
import { providers } from './providers'
import { MailJob } from '../app/Jobs/MailJob'

const app = new Application<ExtendedAppConfig>({
    ...config,
    queue: {
        ...config.queue,
        sync: true,
    },
})

app.register(providers)

app.kernel(AppKernel)

app.boot(async () => {
    app.log().info('Booted')

    await app.make(MailJob).dispatch({ to: 'rick@lifely.nl' })
})

export { app }
