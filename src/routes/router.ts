import {STATUS_CODE_TO_RESPONSE} from '../utils/response'
import {KnownRoute, Method} from '../constants/router'
import {IncomingMessage, ServerResponse} from 'node:http'
import {StatusCode} from '../constants/statusCode'

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params?: Record<string, unknown>
) => Promise<void>

interface Route {
  method: Method
  pattern: RegExp
  handler: RouteHandler
}

export interface IRouter {
  addRoute: (url: KnownRoute, method: Method, handler: RouteHandler) => void
  handleRequest: RouteHandler
}

class Router implements IRouter {
  private routes: Route[] = []

  private createUrlPattern = (url: KnownRoute): RegExp => {
    const pattern = url.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')

    return new RegExp(`^${pattern}$`)
  }

  private getRouteHandler = (url: string, method: string): Route | null => {
    const route = this.routes.find((route) => {
      return route.pattern.test(url) && route.method === method
    })

    if (!route) {
      return null
    }

    return route
  }

  addRoute = (url: KnownRoute, method: Method, handler: RouteHandler): void => {
    const routePattern = this.createUrlPattern(url)
    const route = {
      method,
      pattern: routePattern,
      handler,
    } as Route

    this.routes.push(route)
  }

  handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    const {method, url} = req

    if (!method || !url) {
      STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
      return
    }

    const route = this.getRouteHandler(url, method)

    if (!route) {
      STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
      return
    }

    const match = route.pattern.exec(url)
    const params = match?.groups ?? {}

    return await route.handler(req, res, params)
  }
}

export const appRouter = new Router()
