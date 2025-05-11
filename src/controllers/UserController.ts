import {IncomingMessage, ServerResponse} from 'http'
import {User} from 'models/user'
import {IService} from '../services/service'
import {userService} from '../services/UserService'
import { getParsedBody } from '../utils/requestBody'
import { InvalidInputError } from '../utils/errors'

class UserController {
  private service: IService<User>

  constructor(service: IService<User>) {
    this.service = service
  }

  create = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      const body = await getParsedBody(req) as Partial<User>
      const user = await this.service.create(body)

      res.statusCode = 201
      res.end(JSON.stringify(user))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        res.statusCode = 400
        res.end('Invalid input data')
        return
      }
      res.statusCode = 500
      res.end('Internal server error')
    } 
  }

  getAll = async (_: IncomingMessage, res: ServerResponse): Promise<void>  => {
    const all = await this.service.getAll()

    res.statusCode = 200
    res.end(JSON.stringify(all))
  }

  getById = async (
    _: IncomingMessage, 
    res: ServerResponse, 
    params = {} as Record<string, unknown>
  ): Promise<void>  => {
    if (!params.id) {
      res.statusCode = 400
      res.end('bad request')
      return
    }

    try {
      const user = await this.service.getById(params.id as string)
  
      if (!user) {
        res.statusCode = 404
        res.end('Not found')
        return
      }
  
      res.statusCode = 200
      res.end(JSON.stringify(user))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        res.statusCode = 400
        res.end('bad request')
        return
      }

      res.statusCode = 500
      res.end('Internal server error')
    }

  }

  updateById = async(
    req: IncomingMessage, 
    res: ServerResponse, 
    params = {} as Record<string, unknown>
  ): Promise<void> => {
    if (!params.id) {
      res.statusCode = 400
      res.end('bad request')
      return
    }
    
    try {
      const body = await getParsedBody(req) as Partial<User>
      const updatedUser = await this.service.update(params.id as string, body)

      res.statusCode = 200
      res.end(JSON.stringify(updatedUser))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        res.statusCode = 400
        res.end('bad request')
        return
      }

      res.statusCode = 500
      res.end('Internal server error')
    }
  } 
}

export const userController = new UserController(userService)
