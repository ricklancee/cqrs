import { ServiceProvider } from '../framework/Container/ServiceProvider'

export class AppServiceProvider extends ServiceProvider {
    async register() {
        await this.autobinder.autobind(__dirname, [
            `./Command/**/*`,
            `./Jobs/**/*`,
            `./Routes/**/*`,
        ])
    }
}
