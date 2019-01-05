import 'reflect-metadata'
import { bootstrapContainer } from './container'
import { EventEmitterServiceProvider } from './core/EventEmitter/EventEmitterServiceProvider'

// Boot application
;(async () => {
    console.log('Starting application...')
    await bootstrapContainer([EventEmitterServiceProvider])
})()
