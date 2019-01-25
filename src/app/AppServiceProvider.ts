import { ServiceProvider } from '../framework/Container/ServiceProvider'

export class AppServiceProvider extends ServiceProvider {
    register() {
        this.autobinder.autobind(__dirname, [`./Command/**/*`, `./Routes/**/*`])
    }
}
