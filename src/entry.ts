import {appRouter} from './routes'
import {ENV} from './utils/env'
import {createServer, IncomingMessage, ServerResponse} from 'node:http'

const PORT = ENV.PORT
const server = createServer()

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  appRouter.handleRequest(req, res)
}

server.on('request', requestHandler)

server.listen(PORT, () => {
  console.log('serving on %s port', PORT)
})
