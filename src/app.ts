import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { Disposable } from 'graphql-ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { APP_PATH, APP_PORT } from './core/environment/'
import { UserToken } from './core/models'
import { dateUtils, token_utils } from './core/utils'
import AppDataSource from './mysql/AppDataSource'
import { schema } from './mysql/schema'
import { setGraphQLError } from './mysql/utils'

type Context = {
    token: string | null
    user: UserToken | null
    create_at: string | null
    expires_at: string | null
}

const app = express()

const httpServer = createServer(app)

const wsServer = new WebSocketServer({
    server: httpServer,
    path: APP_PATH
})

const getTokenUser = (_token: string) => {
    const token = token_utils.getToken(_token)
    const tokenData = token_utils.decodedToken(token)
    return {
        token,
        ...tokenData
    }
}

const serverCleanup: Disposable = useServer(
    {
        schema,
        context: async (ctx) => {
            return getTokenUser(ctx.connectionParams.Authorization as string)
        },
        onConnect: async (ctx) => {
            console.log('onConnect')
            const token = getTokenUser(ctx.connectionParams.Authorization as string)
            if (!token.user) throw new Error('User is not authenticated')
        }
    },
    wsServer
)

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

const noTokenNeeded = ['LoginUser', 'CreateUser', 'CheckIfEmailRegistered', 'IntrospectionQuery']

const setMiddleware = () => {
    app.use(
        APP_PATH,
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                if (noTokenNeeded.includes(req.body.operationName)) {
                    return {
                        token: null,
                        user: null,
                        create_at: dateUtils.now(),
                        expires_at: dateUtils.now()
                    }
                }
                const token = getTokenUser(req.headers.authorization)
                if (!token.user)
                    setGraphQLError('User is not authenticated', 'UNAUTHENTICATED', 401)
                return token
            }
        })
    )
}

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
