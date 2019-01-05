import { Container } from 'inversify'
import { registerProviders } from './framework/IOCProvider'
import {
    EventEmitterBinding,
    EventEmitter,
} from './framework/EventEmitter/EventEmitter'
import { EventEmitterServiceProvider } from './framework/EventEmitter/EventEmitterServiceProvider'

const container = new Container()

export const bootstrapContainer = async () => {
    const providers = [EventEmitterServiceProvider].map(
        Provider => new Provider(container)
    )
    await registerProviders(providers)
}

// Aliases
export const emitter = () => container.get<EventEmitter>(EventEmitterBinding)
