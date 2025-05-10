import {IncomingMessage, ServerResponse} from 'http'
import {User} from 'models/user'
import {IService} from '../services/service'
import {userService} from '../services/UserService'

class UserController {
  private service: IService<User>

  constructor(service: IService<User>) {
    this.service = service
  }

  create = async (req: IncomingMessage, res: ServerResponse) => {
    console.log('req', req)
    console.log('res', res)
  }

  getAll = async (_: IncomingMessage, res: ServerResponse) => {
    const all = await this.service.getAll()

    res.statusCode = 200
    res.end(JSON.stringify(all))
  }
}

export const userController = new UserController(userService)
