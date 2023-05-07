import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { Disposable } from 'graphql-ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import { APP_PATH, APP_PORT } from './core/environment/'
import { UserToken } from './core/models'
import { dateUtils, token_utils } from './core/utils'
import AppDataSource from './mysql/AppDataSource'
import { schema } from './mysql/schema'
import { wsService } from './ws'
import { GraphQLError } from 'graphql'
import { setGraphQLError } from './mysql/utils'

const app = express()
const httpServer = createServer(app)

type Context = {
    token: string | null
    user: UserToken | null
    create_at: string | null
    expires_at: string | null
}

// Set up GraphQL-WS server.
const wsServer = new wsService(httpServer).getWsServer()

const serverCleanup: Disposable = useServer({ schema }, wsServer)

// Set up ApolloServer.
const server = new ApolloServer<Context>({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose()
                    }
                }
            }
        }
    ]
})

const setMiddleware = () => {
    app.use(
        APP_PATH,
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                // Si la operación es  LoginUser, CreateUser  no se necesita token.
                if (
                    req.body.operationName === 'LoginUser' ||
                    req.body.operationName === 'CreateUser' ||
                    req.body.operationName === 'CheckIfEmailRegistered' ||
                    req.body.operationName === 'IntrospectionQuery'
                ) {
                    return {
                        token: null,
                        user: null,
                        create_at: dateUtils.now(),
                        expires_at: dateUtils.now()
                    }
                }
                // para el resto de las operaciones  se necesita token.
                const token = token_utils.getToken(req.headers.authorization)
                const tokenData = token_utils.decodedToken(token)

                if (!tokenData.user) {
                    setGraphQLError('User is not authenticated', 'UNAUTHENTICATED', 401)
                }
                return {
                    token,
                    ...tokenData
                }
            }
        })
    )
}

//Set up MySQL connection.
AppDataSource.initialize()
    .then(async () => {
        console.log(`🚀 MySQL connected successfully`)
        await server.start()
    })
    .then(() => {
        setMiddleware()
        httpServer.listen(APP_PORT, () => {
            console.log(`🚀 Query endpoint ready at http://localhost:${APP_PORT}${APP_PATH}`)
            console.log(`🚀 Subscription endpoint ready at ws://localhost:${APP_PORT}${APP_PATH}`)
        })
    })
