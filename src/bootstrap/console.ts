import 'reflect-metadata'
require('dotenv').config()

import { Application } from '../framework/App'
import { config, ExtendedAppConfig } from './config'
import { providers } from './providers'
import { ConsoleKerel } from '../app/ConsoleKernel'

const app = new Application<ExtendedAppConfig>(config)

app.register(providers)

app.kernel(ConsoleKerel)

app.boot(() => {
    app.log().info('Booted')
})

export { app }
