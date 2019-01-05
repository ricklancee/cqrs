import { EventEmitter } from './EventEmitter'
import { EventEmitter2 } from 'eventemitter2'
import { injectable } from 'inversify'

@injectable()
export class NodeEventEmitter implements EventEmitter {
    private emitter: EventEmitter2

    public constructor() {
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: ':',
        })
    }

    public on(event: string | string[], listener: EventListener): this {
        this.emitter.on(event, listener)
        return this
    }

    public emit(event: string | string[], ...values: any[]): boolean {
        return this.emitter.emit(event, values)
    }
}
