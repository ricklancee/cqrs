import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { AppKernel } from '../app/AppKernel'
import { config, ExtendedAppConfig } from './config'
import { providers } from './providers'

const app = new Application<ExtendedAppConfig>(config)

app.register(providers)

app.kernel(AppKernel)

app.boot(() => {
    app.log().info('Booted')
})

export { app }
