import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '../core/environment'

const AppOptions = {
    type: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    synchronize: false,
    logging: false,
    entities: [__dirname + '/entities/**/*.{ts,js}'],
    migrations: [__dirname + '/migrations/**/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [__dirname + '/subscriber/**/*.ts']
} as DataSourceOptions

const AppDataSource = new DataSource(AppOptions)

export default AppDataSource
