import {createServer, IncomingMessage, ServerResponse} from 'node:http'
import {IRouter} from 'routes/router'

const requestHandler = (
  router: IRouter,
  req: IncomingMessage,
  res: ServerResponse
) => {
  router.handleRequest(req, res)
}

export const startServer = (port: string | number, router: IRouter): void => {
  const server = createServer()

  server.on('request', requestHandler.bind(null, router))

  server.listen(port, () => {
    console.log('serving %s port', port)
  })
}
