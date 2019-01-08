import { ServiceProvider } from '../ServiceProvider'
import {
    HttpServer,
    HttpServerBinding,
    HttpServerOptionsBinding,
    HttpServerOptions,
} from './HttpServer'
import { ExpressHttpServer } from './ExpressHttpServer'

export class HttpServerServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<HttpServerOptions>(HttpServerOptionsBinding)
            .toConstantValue(this.config.http)

        this.container
            .bind<HttpServer>(HttpServerBinding)
            .to(ExpressHttpServer)
            .inSingletonScope()
    }
}
