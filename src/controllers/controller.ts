import {IncomingMessage, ServerResponse} from 'http'

export interface IController {
  create: (req: IncomingMessage, res: ServerResponse) => Promise<void>
  getAll: (req: IncomingMessage, res: ServerResponse) => Promise<void>
  getById: (
    req: IncomingMessage,
    res: ServerResponse,
    params?: Record<string, unknown>
  ) => Promise<void>
  updateById: (
    req: IncomingMessage,
    res: ServerResponse,
    params?: Record<string, unknown>
  ) => Promise<void>
  deleteById: (
    req: IncomingMessage,
    res: ServerResponse,
    params?: Record<string, unknown>
  ) => Promise<void>
}
