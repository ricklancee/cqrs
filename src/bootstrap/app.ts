import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { HttpKernel } from '../app/HttpKernel'
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

app.kernel(HttpKernel)

app.boot(async () => {
    await User.sync({ force: true })
    app.log().info('Booted')
})

export { app }
