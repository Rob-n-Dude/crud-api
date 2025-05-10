import {appRouter} from './routes'
import {ENV} from './utils/env'
import {createServer, IncomingMessage, ServerResponse} from 'node:http'

const PORT = ENV.PORT
const server = createServer()

const errorHandler = (e: unknown) => {
  console.log('eeeeeror', e)
}

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  appRouter.handleRequest(req, res)
}

server.on('request', requestHandler)
server.on('error', errorHandler)

server.listen(PORT, () => {
  console.log('serving on %s port', PORT)
})
