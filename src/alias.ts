import { container } from "./container";
import { EventEmitter, EventEmitterBinding } from "./EventEmitter/EventEmitter";

export const emitter = () => container.get<EventEmitter>(EventEmitterBinding)