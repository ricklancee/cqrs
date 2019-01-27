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
import {
    ExceptionHandlerBinding,
    ExceptionHandler,
} from '../Exception/ExceptionHandler'

export const QueueBinding = Symbol.for('QueueBinding')
export const QueueOptionsBinding = Symbol.for('QueueOptionsBinding')

export interface QueueOptions {
    jobs: NewableJob[]
    sync?: boolean
}

@injectable()
export class Queue {
    private client: RedisClient
    private subscriber: RedisClient

    private queues = new Map<string, BullQueue.Queue>()

    private globalOptions = {
        defaultJobOptions: {},
        createClient: (type: string) => {
            // This reduces the total amount of connections to redis.
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
        @inject(LoggerBinding) private logger: Logger,
        @inject(ExceptionHandlerBinding)
        private exceptionHandler: ExceptionHandler
    ) {
        this.client = this.redisFactory.createClient()
        this.subscriber = this.redisFactory.createClient()
    }

    public async processQueues() {
        const processes = []

        for (const queueStatic of this.options.jobs) {
            const queue = this.getQueue(queueStatic.onQueue)
            const job = this.app.make<Job>(queueStatic)

            this.logger.debug(
                `Starting processing job "${queueStatic.name}" on queue "${
                    queueStatic.onQueue
                }" with concurrency "${queueStatic.concurrency}"`
            )

            const concurrency = queueStatic.concurrency || 1
            const handler = async (bullJob: BullQueue.Job) => {
                await job.handle(bullJob.data)
            }

            if (queueStatic.schedule) {
                processes.push(
                    queue.process(queueStatic.name, concurrency, handler)
                )
            } else {
                processes.push(queue.process(concurrency, handler))
            }
        }

        await this.addScheduledJobsToQueue()

        // queue.process returns a promise, we want to await these all
        // to avoid these not getting resolved
        await Promise.all(processes)
    }

    public registerQueues() {
        for (const queueStatic of this.options.jobs) {
            this.logger.debug(
                `Registering "${queueStatic.name}" on queue "${
                    queueStatic.onQueue
                }"...`
            )

            const queue = new BullQueue(queueStatic.onQueue, this.globalOptions)
            this.registerEventHandlersForQueue(queue)

            this.queues.set(queueStatic.onQueue, queue)
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

    public async clear() {
        for (const [name, queue] of this.queues) {
            await queue.empty()
        }
    }

    private async addScheduledJobsToQueue() {
        for (const queueStatic of this.options.jobs) {
            if (!queueStatic.schedule) {
                continue
            }

            const queue = this.getQueue(queueStatic.onQueue)

            const jobs = await queue.getRepeatableJobs()

            const oldScheduledJobs = jobs.filter(
                job =>
                    job.name === queueStatic.name &&
                    job.cron !== queueStatic.schedule
            )

            // remove old job
            for (const staleJob of oldScheduledJobs) {
                this.logger.debug(
                    `Removing old repeatable job "${
                        staleJob.name
                    }" with schedule "${staleJob.cron}" from queue "${
                        queueStatic.onQueue
                    }"...`
                )

                await queue.removeRepeatable(queueStatic.name, {
                    jobId: staleJob.id,
                    cron: staleJob.cron,
                })
            }

            this.logger.debug(
                `Adding "${queueStatic.name}" schedule "${
                    queueStatic.schedule
                }" on queue "${queueStatic.onQueue}"...`
            )

            await queue.add(
                queueStatic.name,
                {}, // a scheduled job does not need any payload
                {
                    repeat: { cron: queueStatic.schedule },
                }
            )
        }
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

    private registerEventHandlersForQueue(queue: BullQueue.Queue) {
        const queueName = queue.name

        queue.on('error', async (job, error) => {
            this.logger.error(
                `[queue:${queueName}] ${
                    job
                        ? `An error occured on job with id "${
                              job.id
                          }" has failed; Attempts: "${job.attemptsMade}"`
                        : error.message
                }`
            )
            await this.exceptionHandler.report(error)
        })

        queue.on('active', job => {
            this.logger.debug(
                `[queue:${queueName}] Job with id "${job.id}" has started`
            )
        })

        queue.on('completed', job => {
            this.logger.debug(
                `[queue:${queueName}] Job with id "${job.id}" has completed`
            )
        })

        // A job has failed
        queue.on('failed', async (job, error) => {
            this.logger.error(
                `[queue:${queueName}] Job with id "${
                    job.id
                }" has failed; Attempts: "${job.attemptsMade}"`
            )
            await this.exceptionHandler.report(error)
        })

        // A job has been marked as stalled. This is useful for debugging job
        // workers that crash or pause the event loop.
        queue.on('stalled', job => {
            this.logger.warn(
                `[queue:${queueName}] job with id "${job.id}" has stalled`
            )
        })

        // The queue has been paused.
        queue.on('paused', () => {
            this.logger.info(`[queue:${queueName}] The queue has been paused`)
        })

        // The queue has been resumed.
        queue.on('resumed', () => {
            this.logger.info(`[queue:${queueName}] The queue has been resumed`)
        })

        // The queue has been cleaned.
        queue.on('cleaned', (job, type) => {
            this.logger.info(
                `[queue:${queueName}] Cleaned ${job.length} ${type} jobs'`
            )
        })
    }
}
