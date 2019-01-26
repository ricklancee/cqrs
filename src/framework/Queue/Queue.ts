import { injectable, inject } from 'inversify'
import BullQueue from 'bull'
import {
    RedisFactoryBinding,
    RedisFactory,
    RedisClient,
} from '../Redis/RedisFactory'
import { Job, NewableJob } from './Job'
import { LoggerBinding, Logger } from '../Logger/Logger'
import { AppBinding, Application } from '../App'

export const QueueBinding = Symbol.for('QueueBinding')
export const QueueOptionsBinding = Symbol.for('QueueOptionsBinding')

export interface QueueOptions {
    jobs: NewableJob[]
    sync?: boolean
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
        @inject(AppBinding) private app: Application,
        @inject(RedisFactoryBinding) private redisFactory: RedisFactory,
        @inject(LoggerBinding) private logger: Logger
    ) {
        this.client = this.redisFactory.createClient()
        this.subscriber = this.redisFactory.createClient()
    }

    public processQueues() {
        for (const queueStatic of this.options.jobs) {
            const queue = this.getQueue(queueStatic.onQueue)
            const job = this.app.make<Job>(queueStatic)

            this.logger.debug(
                `Starting processing job "${queueStatic.name}" on queue "${
                    queueStatic.onQueue
                }" with concurrency "${queueStatic.concurrency}"`
            )
            queue.process(
                queueStatic.concurrency || 1,
                async (bullJob: BullQueue.Job) => {
                    await job.handle(bullJob.data)
                }
            )
        }
    }

    public registerQueues() {
        for (const queueStatic of this.options.jobs) {
            this.logger.debug(
                `Registering "${queueStatic.name}" on queue "${
                    queueStatic.onQueue
                }"...`
            )
            this.queues.set(
                queueStatic.onQueue,
                new BullQueue(queueStatic.onQueue, this.globalOptions)
            )
        }
    }

    public async add(
        onQueue: string,
        payload: object,
        jobOptions?: BullQueue.JobOptions
    ) {
        this.logger.debug(
            `Adding a job on queue "${onQueue}" with payload:\n${JSON.stringify(
                payload,
                null,
                2
            )}`
        )

        await this.getQueue(onQueue).add(payload, jobOptions)
    }

    private getQueue(name: string) {
        if (!this.queues.has(name)) {
            throw new Error(
                `Queue "${name}" does not exists; try one of the following: ${Object.keys(
                    this.queues
                ).join(', ')}`
            )
        }

        return this.queues.get(name)
    }
}
