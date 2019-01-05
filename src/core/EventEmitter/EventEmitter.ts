export interface EventListener {
    (...values: any[]): void
}

export interface EventEmitter {
    on(event: string | string[], listener: EventListener): this
    emit(event: string | string[], ...values: any[]): boolean
}

export const EventEmitterBinding = Symbol.for('EventEmitter')
