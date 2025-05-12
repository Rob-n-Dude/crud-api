import {StatusCode} from '../constants/statusCode'
import {UserMessage} from '../constants/userMessage'
import {ServerResponse} from 'http'
import {InvalidInputError, NotFoundError} from './errors'

const setupResponse = (
  response: ServerResponse,
  code: StatusCode,
  message: UserMessage | string
): ServerResponse => {
  response.statusCode = code
  response.end(message)

  return response
}

type ResponseHandlerWithMessage = (
  res: ServerResponse,
  message: string
) => ServerResponse
type ResponseHandlerWithoutMessage = (res: ServerResponse) => ServerResponse

type CodeToResponse = {
  [key in StatusCode]: key extends StatusCode.OK | StatusCode.CREATED
    ? ResponseHandlerWithMessage
    : ResponseHandlerWithoutMessage
}

export const STATUS_CODE_TO_RESPONSE: CodeToResponse = {
  [StatusCode.OK]: (res, message) => setupResponse(res, StatusCode.OK, message),
  [StatusCode.BAD_REQUEST]: (res) =>
    setupResponse(res, StatusCode.BAD_REQUEST, UserMessage.BAD_REQUEST),
  [StatusCode.CREATED]: (res, message) =>
    setupResponse(res, StatusCode.CREATED, message),
  [StatusCode.SERVER_ERROR]: (res) =>
    setupResponse(res, StatusCode.SERVER_ERROR, UserMessage.SERVER_ERROR),
  [StatusCode.NOT_FOUND]: (res) =>
    setupResponse(res, StatusCode.NOT_FOUND, UserMessage.NOT_FOUND),
}

export const errorToResponse = (e: unknown, res: ServerResponse) => {
  if (e instanceof InvalidInputError) {
    STATUS_CODE_TO_RESPONSE[StatusCode.BAD_REQUEST](res)
    return
  }

  if (e instanceof NotFoundError) {
    STATUS_CODE_TO_RESPONSE[StatusCode.NOT_FOUND](res)
    return
  }

  STATUS_CODE_TO_RESPONSE[StatusCode.SERVER_ERROR](res)
}
