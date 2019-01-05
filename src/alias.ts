import { container } from './container'
import { EventEmitter } from 'events'
import { EventEmitterBinding } from './core/EventEmitter/EventEmitter'

export const emitter = () => container.get<EventEmitter>(EventEmitterBinding)
