import 'reflect-metadata'
import { bootstrapContainer } from './container'
import { startServer } from './api/api'

// Boot application
;(async () => {
    console.log('Starting application...')
    await bootstrapContainer()
    startServer()
})()
