import Redis from 'ioredis'
import { inject, injectable } from 'inversify'

export const RedisFactoryOptionsBinding = Symbol.for(
    'RedisFactoryOptionsBinding'
)
export const RedisFactoryBinding = Symbol.for('RedisFactoryBinding')

export interface RedisOptions {
    port: number
    host: string
    /** 4 (IPv4) or 6 (IPv6) */
    family: 4 | 6
    password: string
    db: number
}

export type RedisClient = Redis.Redis

@injectable()
export class RedisFactory {
    private clients = new Set<Redis.Redis>()

    constructor(
        @inject(RedisFactoryOptionsBinding) private options: RedisOptions
    ) {}

    public createClient() {
        const client = new Redis(this.options)
        this.clients.add(client)
        return client
    }

    public async close() {
        for (const client of this.clients) {
            await client.quit()
        }
    }
}
