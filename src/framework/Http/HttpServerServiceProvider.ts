import { ServiceProvider } from '../ServiceProvider'
import {
    HttpServer,
    HttpServerBinding,
    HttpServerOptionsBinding,
    HttpServerOptions,
} from './HttpServer'
import { ExpressHttpServer } from './ExpressHttpServer'
import { HttpMiddleware } from './HttpMiddleware'
import { CorsMiddleware } from './Middleware/CorsMiddleware'
import { SecurityHeadersMiddleware } from './Middleware/SecurityHeadersMiddleware'

export class HttpServerServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind<HttpServerOptions>(HttpServerOptionsBinding)
            .toConstantValue(this.config.http)

        this.container
            .bind<HttpMiddleware>(CorsMiddleware)
            .to(CorsMiddleware)
            .inSingletonScope()

        this.container
            .bind<HttpMiddleware>(SecurityHeadersMiddleware)
            .to(SecurityHeadersMiddleware)
            .inSingletonScope()

        this.container
            .bind<HttpServer>(HttpServerBinding)
            .to(ExpressHttpServer)
            .inSingletonScope()
    }
}
