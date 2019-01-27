import { ServiceProvider } from '../Container/ServiceProvider'
import {
    DatabaseManagerBinding,
    DatabaseManager,
    DatabaseOptionsBinding,
} from './DatabaseManager'

export class DatabaseServiceProvider extends ServiceProvider {
    public register() {
        this.container
            .bind(DatabaseOptionsBinding)
            .toConstantValue(this.config.database)

        this.container
            .bind(DatabaseManagerBinding)
            .to(DatabaseManager)
            .inSingletonScope()
    }

    public async boot() {
        console.log('boot')

        await this.container
            .get<DatabaseManager>(DatabaseManagerBinding)
            .isConnected()
    }
}
