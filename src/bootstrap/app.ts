import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { AppKernel } from '../app/AppKernel'
import { config, ExtendedAppConfig } from './config'
import { providers } from './providers'
import { User } from '../app/User.model'

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
    await User.sync({ force: true })
    app.log().info('Booted')
})

export { app }
