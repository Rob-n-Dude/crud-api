import {UserMessage} from '../constants/userMessage'

export class InvalidInputError extends Error {
  constructor() {
    super(UserMessage.INVALID_INPUT)
  }
}

export class NotFoundError extends Error {
  constructor() {
    super(UserMessage.NOT_FOUND)
  }
}
