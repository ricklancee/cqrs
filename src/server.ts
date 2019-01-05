import 'reflect-metadata'
import { bootstrapContainer } from './container'
import { startServer } from './api/http'

// Boot application
;(async () => {
    console.log('Starting application...')
    await bootstrapContainer()
    startServer()
})()
