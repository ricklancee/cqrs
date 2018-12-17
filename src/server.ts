
import "reflect-metadata";
import { startServer } from "./grapql";
import { bootstrapContainer } from "./container";
import { EventEmitterServiceProvider } from "./EventEmitter/EventEmitterServiceProvider";

;(async () => {
    await bootstrapContainer([
        EventEmitterServiceProvider
    ])
    startServer()
})()
