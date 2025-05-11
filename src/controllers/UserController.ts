import {IncomingMessage, ServerResponse} from 'http'
import {User} from 'models/user'
import {IService} from '../services/service'
import {userService} from '../services/UserService'
import {getParsedBody} from '../utils/requestBody'
import {InvalidInputError, NotFoundError} from '../utils/errors'
import {STATUS_CODE_TO_RESPONSE} from '../utils/response'
import {StatusCode} from '../constants/statusCode'
import {UserMessage} from '../constants/userMessage'

class UserController {
  private service: IService<User>

  constructor(service: IService<User>) {
    this.service = service
  }

  create = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      const body = (await getParsedBody(req)) as Partial<User>
      const user = await this.service.create(body)

      STATUS_CODE_TO_RESPONSE[StatusCode.CREATED](res, JSON.stringify(user))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
        return
      }

      STATUS_CODE_TO_RESPONSE[StatusCode.SERVER_ERROR](res)
    }
  }

  getAll = async (_: IncomingMessage, res: ServerResponse): Promise<void> => {
    const all = await this.service.getAll()

    STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, JSON.stringify(all))
  }

  getById = async (
    _: IncomingMessage,
    res: ServerResponse,
    params = {} as Record<string, unknown>
  ): Promise<void> => {
    if (!params.id) {
      STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
      return
    }

    try {
      const user = await this.service.getById(params.id as string)

      if (!user) {
        STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
        return
      }

      STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, JSON.stringify(user))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
        return
      } else if (e instanceof NotFoundError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
        return
      }

      STATUS_CODE_TO_RESPONSE[StatusCode.SERVER_ERROR](res)
    }
  }

  updateById = async (
    req: IncomingMessage,
    res: ServerResponse,
    params = {} as Record<string, unknown>
  ): Promise<void> => {
    if (!params.id) {
      STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
      return
    }

    try {
      const body = (await getParsedBody(req)) as Partial<User>
      const updatedUser = await this.service.update(params.id as string, body)

      STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, JSON.stringify(updatedUser))
    } catch (e) {
      if (e instanceof InvalidInputError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
        return
      } else if (e instanceof NotFoundError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
        return
      }

      STATUS_CODE_TO_RESPONSE[StatusCode.SERVER_ERROR](res)
    }
  }

  deleteById = async (
    _: IncomingMessage,
    res: ServerResponse,
    params = {} as Record<string, unknown>
  ): Promise<void> => {
    if (!params.id) {
      STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
      return
    }

    try {
      await this.service.delete(params.id as string)

      STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, UserMessage.OK)
    } catch (e) {
      if (e instanceof InvalidInputError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
        return
      } else if (e instanceof NotFoundError) {
        STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
        return
      }

      STATUS_CODE_TO_RESPONSE[StatusCode.SERVER_ERROR](res)
    }
  }
}

export const userController = new UserController(userService)
