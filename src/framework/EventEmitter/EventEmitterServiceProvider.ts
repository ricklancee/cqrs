import { EventEmitter, EventEmitterBinding } from './EventEmitter'
import { NodeEventEmitter } from './NodeEventEmitter'
import { ServiceProvider } from '../IOCProvider'

export class EventEmitterServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<EventEmitter>(EventEmitterBinding)
            .to(NodeEventEmitter)
            .inSingletonScope()
    }
}
