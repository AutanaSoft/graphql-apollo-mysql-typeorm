import { DataSource } from 'typeorm'

import { MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '../core/environment'
import { Users } from './entities'

export const connectToMysql = new DataSource({
    type: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    synchronize: true,
    ssl: false,
    entities: [Users]
})
