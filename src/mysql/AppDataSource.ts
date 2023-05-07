import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '../core/environment'
import { Profiles, Users } from './entities'

const AppDataSource = new DataSource({
    type: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    entities: [Users, Profiles],
    synchronize: true,
    logging: false,
    migrationsTableName: 'migrations',
    migrations: ['migrations/**/*{.ts,.js}'],
    subscribers: ['subscribers/**/*{.ts,.js}']
})

export default AppDataSource
