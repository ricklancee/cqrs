import { injectable, inject } from 'inversify'
import { LoggerBinding, Logger } from '../Logger/Logger'
import { createNamespace } from 'cls-hooked'
import { Sequelize } from 'sequelize-typescript'

// Add CLS to Sequelize.
// http://docs.sequelizejs.com/manual/tutorial/transactions.html#automatically-pass-transactions-to-all-queries
// https://github.com/RobinBuschmann/sequelize-typescript/issues/336
const namespace = createNamespace('sequelize-cls-namespace')
;(Sequelize as any).__proto__.useCLS(namespace)

export interface DatabaseOptions {
    database: string
    username: string
    password: string
    host: string
    modelPaths: string[]
}

export const DatabaseOptionsBinding = Symbol.for('DatabaseOptionsBinding')
export const DatabaseManagerBinding = Symbol.for('DatabaseManagerBinding')

@injectable()
export class DatabaseManager {
    private connection: Sequelize

    constructor(
        @inject(DatabaseOptionsBinding) options: DatabaseOptions,
        @inject(LoggerBinding) private logger: Logger
    ) {
        this.connection = new Sequelize({
            database: options.database,
            dialect: 'postgres',
            host: options.host,
            username: options.username,
            password: options.password,
            // operatorsAliases: Sequelize.Op,
            modelPaths: options.modelPaths,
            modelMatch: (filename, member) => {
                return (
                    // Matches .model extensions with the class
                    filename.substring(0, filename.indexOf('.model')) === member
                )
            },
        })
    }

    public async isConnected() {
        this.logger.debug('Checking database connection...')
        await this.connection.authenticate()
        this.logger.debug('...database connected.')
    }

    public getConnection() {
        return this.connection
    }
}
