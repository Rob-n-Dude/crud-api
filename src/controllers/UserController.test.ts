import {UserController} from './UserController'
import {User} from 'models/user'
import {IncomingMessage, ServerResponse} from 'http'
import {UserMessage} from '../constants/userMessage'

jest.mock('../utils/requestBody', () => ({
  getParsedBody: jest.fn(() => Promise.resolve({})),
}))

const mockService = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('UserController', () => {
  let userController: UserController

  beforeEach(() => {
    userController = new UserController(mockService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      const mockUser = {id: '1', username: 'John Doe'} as User
      mockService.create.mockResolvedValue(mockUser)

      await userController.create(req, res)

      expect(mockService.create).toHaveBeenCalled()
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockUser))
    })
  })

  describe('getAll', () => {
    it('should get all users', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      const mockUsers = [{id: '1', username: 'John Doe'}] as User[]
      mockService.getAll.mockResolvedValue(mockUsers)

      await userController.getAll(req, res)

      expect(mockService.getAll).toHaveBeenCalled()
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockUsers))
    })
  })

  describe('getById', () => {
    it('should get a user by Id', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      const mockUser = {id: '1', username: 'John Doe'} as User
      mockService.getById.mockResolvedValue(mockUser)

      await userController.getById(req, res, {id: '1'})

      expect(mockService.getById).toHaveBeenCalledWith('1')
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockUser))
    })

    it('should respond with 400 if no id is provided', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      await userController.getById(req, res, {})

      expect(res.end).toHaveBeenCalledWith(UserMessage.BAD_REQUEST)
      expect(res.statusCode).toBe(400)
    })

    it('should respond with 404 if user is not found', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      mockService.getById.mockResolvedValue(null)

      await userController.getById(req, res, {id: '1'})

      expect(mockService.getById).toHaveBeenCalledWith('1')
      expect(res.end).toHaveBeenCalledWith(UserMessage.NOT_FOUND)
      expect(res.statusCode).toBe(404)
    })
  })
  describe('updateById', () => {
    it('should update a user by Id', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      const mockUser = {id: '1', username: 'John Doe'} as User
      mockService.update.mockResolvedValue(mockUser)

      await userController.updateById(req, res, {id: '1'})

      expect(mockService.update).toHaveBeenCalledWith('1', {})
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockUser))
    })

    it('should respond with 400 if no id is provided', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      await userController.updateById(req, res, {})

      expect(res.end).toHaveBeenCalledWith(UserMessage.BAD_REQUEST)
      expect(res.statusCode).toBe(400)
    })
  })

  describe('deleteById', () => {
    it('should delete a user by Id', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      mockService.delete.mockResolvedValue(true)

      await userController.deleteById(req, res, {id: '1'})

      expect(mockService.delete).toHaveBeenCalledWith('1')
      expect(res.end).toHaveBeenCalledWith(UserMessage.OK)
    })

    it('should respond with 400 if no id is provided', async () => {
      const req = {} as IncomingMessage
      const res = {
        end: jest.fn(),
      } as unknown as ServerResponse

      await userController.deleteById(req, res, {})

      expect(res.end).toHaveBeenCalledWith(UserMessage.BAD_REQUEST)
      expect(res.statusCode).toBe(400)
    })
  })
})
