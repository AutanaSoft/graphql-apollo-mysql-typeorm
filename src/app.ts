import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import { createServer } from 'http'
import WebSocket, { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import bodyParser from 'body-parser'
import cors from 'cors'
import { schema } from './mysql/schema'
import { APP_PATH, APP_PORT } from './globals'
import { Disposable } from 'graphql-ws'
import { connectToMysql } from './mysql'
import { authUtil } from './util'

const app = express()
const httpServer = createServer(app)

// Set up WebSocket server.
const wsServer: WebSocket.Server<WebSocket.WebSocket> = new WebSocketServer({
  server: httpServer,
  path: APP_PATH
})

const serverCleanup: Disposable = useServer(
  {
    schema
  },
  wsServer
)

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
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

// Application Initialization
export const init = async () => {
  try {
    await connectToMysql.initialize()
    console.log(`🚀 MySQL connected successfully`)
    await server.start()
    app.use(
      APP_PATH,
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          const token = req.headers.authorization?.split(' ')[1] || 'NO TOKEN PROVIDED'
          return authUtil.verifyToken(token)
        }
      })
    )

    // Now that our HTTP server is fully set up, actually listen.
    httpServer.listen(APP_PORT, () => {
      console.log(`🚀 Query endpoint ready at http://localhost:${APP_PORT}${APP_PATH}`)
      console.log(`🚀 Subscription endpoint ready at ws://localhost:${APP_PORT}${APP_PATH}`)
    })
  } catch (error) {
    console.log(`❌  Error: ${error.message}`)
  }
}

void init()
