import { ServiceProvider } from '../container';
import { EventEmitter, EventEmitterBinding } from './EventEmitter';
import { NodeEventEmitter } from './NodeEventEmitter';

export class EventEmitterServiceProvider extends ServiceProvider {
    public register() {
        this.container.bind<EventEmitter>(EventEmitterBinding).to(NodeEventEmitter).inSingletonScope()
    }
}