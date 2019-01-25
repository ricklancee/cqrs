import { injectable, inject } from 'inversify'
import BullQueue from 'bull'
import {
    RedisFactoryBinding,
    RedisFactory,
    RedisClient,
} from '../Redis/RedisFactory'

export const QueueBinding = Symbol.for('QueueBinding')
export const QueueOptionsBinding = Symbol.for('QueueOptionsBinding')

export interface QueueOptions {
    queues: {
        name: string
        concurrecy?: number
        handler: (payload: any) => void
    }[]
}

@injectable()
export class Queue {
    private client: RedisClient = this.redisFactory.createClient()
    private subscriber: RedisClient = this.redisFactory.createClient()

    private queues = new Map<string, BullQueue.Queue>()

    private globalOptions = {
        defaultJobOptions: {
            removeOnComplete: true,
        },
        createClient: (type: string) => {
            switch (type) {
                case 'client':
                    return this.client
                case 'subscriber':
                    return this.subscriber
                default:
                    return this.redisFactory.createClient()
            }
        },
    }

    constructor(
        @inject(QueueOptionsBinding) private options: QueueOptions,
        @inject(RedisFactoryBinding) private redisFactory: RedisFactory
    ) {
        this.client = this.redisFactory.createClient()
        this.subscriber = this.redisFactory.createClient()
        this.registerQueues()
    }

    public processQueues() {
        for (const queueOpts of this.options.queues) {
            const queue = this.getQueue(queueOpts.name)
            queue.process(queueOpts.concurrecy || 1, queueOpts.handler)
        }
    }

    private registerQueues() {
        for (const queueOpts of this.options.queues) {
            this.queues.set(
                queueOpts.name,
                new BullQueue(queueOpts.name, this.globalOptions)
            )
        }
    }

    public queue(
        onQueue: string,
        payload: any,
        jobOptions?: BullQueue.JobOptions
    ) {
        this.getQueue(onQueue).add(payload, jobOptions)
    }

    private getQueue(name: string) {
        if (!this.queues.has(name)) {
            throw new Error(
                `Queue "${name}" does not exists; try one of the following: ${Object.keys(
                    this.queue
                ).join(', ')}`
            )
        }

        return this.queues.get(name)
    }
}
