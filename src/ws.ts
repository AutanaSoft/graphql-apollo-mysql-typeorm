import WebSocket, { WebSocketServer } from 'ws'
import { APP_PATH } from './core/environment'
import { IncomingMessage, Server, ServerResponse } from 'http'

export class wsService {
    static instance: wsService
    private wsServer: WebSocket.Server<WebSocket.WebSocket>
    constructor(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
        if (wsService.instance) {
            return wsService.instance
        }

        this.wsServer = new WebSocketServer({
            server,
            path: APP_PATH
        })

        this.initServerListeners()

        wsService.instance = this
    }

    getWsServer() {
        return this.wsServer
    }

    private initServerListeners() {
        this.wsServer.on('connection', (socket, request) => {
            console.log('Client connected', request.url)
            /* //verificamos si el token es valido
            const token = request.url.split('=')[1]
            const tokenData = token_utils.decodedToken(token)
            if (!tokenData.user) {
                console.log('User_profile is not authenticated')
                socket.close(1008, 'User_profile is not authenticated')
                return
            } */
        })

        this.wsServer.on('close', (socket, code, reason) => {
            console.log('Client disconnected', code, reason)
        })

        this.wsServer.on('upgrade', (request, socket, head) => {
            console.log('Client upgrade', request.url)
        })

        this.wsServer.addListener('error', (err) => {
            console.error('WebSocket server error', err)
        })
    }
}
