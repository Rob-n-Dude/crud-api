import {KnownRoute, Method} from '../constants/router'
import {IncomingMessage, ServerResponse} from 'node:http'

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>

export interface IRouter {
  addRoute: (url: KnownRoute, method: Method, handler: RouteHandler) => void
  handleRequest: RouteHandler
}

class Router implements IRouter {
  private routes = new Map<string, RouteHandler>()

  private getKey(url: string, method: string): string {
    return `${method.toUpperCase()}-${url}`
  }

  addRoute = (url: KnownRoute, method: Method, handler: RouteHandler): void => {
    const key = this.getKey(url, method)
    this.routes.set(key, handler)
  }

  handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    const {method, url} = req

    if (!method || !url) {
      res.statusCode = 400
      res.end('bad request')
      return
    }

    const key = this.getKey(url, method)

    if (!this.routes.has(key)) {
      res.statusCode = 400
      res.end('bad request')
      return
    }

    const handler = this.routes.get(key) as RouteHandler

    return await handler(req, res)
  }
}

export const appRouter = new Router()
