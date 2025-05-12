import {IncomingMessage, ServerResponse} from 'http'
import {User} from 'models/user'
import {IService} from '../services/service'
import {getParsedBody} from '../utils/requestBody'
import {STATUS_CODE_TO_RESPONSE} from '../utils/response'
import {StatusCode} from '../constants/statusCode'
import {UserMessage} from '../constants/userMessage'
import {IController} from './controller'

export class UserController implements IController {
  private service: IService<User>

  constructor(service: IService<User>) {
    this.service = service
  }

  create = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const body = (await getParsedBody(req)) as Partial<User>
    const user = await this.service.create(body)

    STATUS_CODE_TO_RESPONSE[StatusCode.CREATED](res, JSON.stringify(user))
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

    const user = await this.service.getById(params.id as string)

    if (!user) {
      STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
      return
    }

    STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, JSON.stringify(user))
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

    const body = (await getParsedBody(req)) as Partial<User>
    const updatedUser = await this.service.update(params.id as string, body)

    STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, JSON.stringify(updatedUser))
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

    await this.service.delete(params.id as string)

    STATUS_CODE_TO_RESPONSE[StatusCode.OK](res, UserMessage.OK)
  }
}
