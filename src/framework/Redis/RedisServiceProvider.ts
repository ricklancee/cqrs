import { ServiceProvider } from '../Container/ServiceProvider'
import {
    RedisFactoryOptionsBinding,
    RedisOptions,
    RedisFactory,
    RedisFactoryBinding,
} from './RedisFactory'

export class RedisServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<RedisOptions>(RedisFactoryOptionsBinding)
            .toConstantValue(this.config.redis)

        this.container
            .bind<RedisFactory>(RedisFactoryBinding)
            .to(RedisFactory)
            .inSingletonScope()
    }
}
