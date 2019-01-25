import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { AppKernel } from '../app/AppKernel'
import { config, ExtendedAppConfig } from './config'
import { providers } from './providers'
import { QueueBinding, Queue } from '../framework/Queue/Queue'

const app = new Application<ExtendedAppConfig>(config)

app.register(providers)

app.kernel(AppKernel)

app.boot(() => {
    app.log().info('Booted')
    app.make<Queue>(QueueBinding).processQueues()
})

export { app }
