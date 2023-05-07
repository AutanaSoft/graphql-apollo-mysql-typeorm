import { config } from 'dotenv'

config()

// NODE_ENV
export const NODE_ENV = process.env.NODE_ENV || 'development'

// APP
export const APP_NAME = process.env.APP_NAME || 'Rest API'
export const APP_PATH = process.env.APP_PATH || '/graphql'
export const APP_PORT = Number(process.env.APP_PORT) || 4000
export const APP_WSS = Number(process.env.APP_PORT) || 4000

// MYSQL
export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
export const MYSQL_PORT = Number(process.env.MYSQL_PORT) || 3306
export const MYSQL_DB = process.env.MYSQL_DB || 'rest_api'
export const MYSQL_USER = process.env.MYSQL_USER || 'root'
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'root'

// JWT Config
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h'
