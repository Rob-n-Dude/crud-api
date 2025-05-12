import {UserService} from './UserService'
import {IRepository} from '../../repository/repository'
import {User} from '../../models/user'
import {InvalidInputError, NotFoundError} from '../../utils/errors'

// No mocking of the 'uuid' module is required

const mockRepository: jest.Mocked<IRepository<User>> = {
  create: jest.fn(),
  findAll: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const updatedMockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  username: 'Jane Doe',
  age: 25,
  hobbies: ['painting', 'traveling'],
}

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    jest.clearAllMocks()
    userService = new UserService(mockRepository)
  })

  it('should create a user successfully', async () => {
    const userData = {username: 'John Doe', age: 30, hobbies: ['reading']}
    mockRepository.create.mockResolvedValueOnce(undefined)

    const createdUser = await userService.create(userData)

    expect(createdUser).toMatchObject(userData)
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(userData)
    )
  })

  it('should throw InvalidInputError when creating a user with invalid data', async () => {
    const invalidUserData = {username: '', age: -1, hobbies: []}

    await expect(userService.create(invalidUserData)).rejects.toThrow(
      InvalidInputError
    )
    expect(mockRepository.create).not.toHaveBeenCalled()
  })

  it('should retrieve all users', async () => {
    const users: User[] = [
      {id: '1', username: 'John', age: 25, hobbies: ['gaming']},
      {id: '2', username: 'Jane', age: 30, hobbies: ['reading']},
    ]
    mockRepository.findAll.mockResolvedValueOnce(users)

    const result = await userService.getAll()

    expect(result).toEqual(users)
    expect(mockRepository.findAll).toHaveBeenCalled()
  })

  it('should retrieve a user by ID', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'John',
      age: 25,
      hobbies: ['gaming'],
    }
    mockRepository.read.mockResolvedValueOnce(user)

    const result = await userService.getById(user.id)

    expect(result).toEqual(user)
    expect(mockRepository.read).toHaveBeenCalledWith(user.id)
  })

  it('should throw InvalidInputError when retrieving a user with invalid ID', async () => {
    await expect(userService.getById('invalid-id')).rejects.toThrow(
      InvalidInputError
    )
    expect(mockRepository.read).not.toHaveBeenCalled()
  })

  it('should return null when user is not found by ID', async () => {
    mockRepository.read.mockResolvedValueOnce(null)

    const result = await userService.getById(
      '123e4567-e89b-12d3-a456-426614174000'
    )

    expect(result).toBeNull()
    expect(mockRepository.read).toHaveBeenCalled()
  })

  it('should update a user successfully', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'John',
      age: 25,
      hobbies: ['gaming'],
    }
    mockRepository.read.mockResolvedValueOnce(user)

    const updatedUser = await userService.update(user.id, updatedMockUser)

    expect(updatedUser).toEqual(updatedMockUser)
    expect(mockRepository.update).toHaveBeenCalledWith(user.id, updatedMockUser)
  })

  it('should throw InvalidInputError when updating a user with invalid data', async () => {
    const invalidUserData = {username: '', age: -1, hobbies: []}

    await expect(
      userService.update(
        '123e4567-e89b-12d3-a456-426614174000',
        invalidUserData
      )
    ).rejects.toThrow(InvalidInputError)
    expect(mockRepository.update).not.toHaveBeenCalled()
  })

  it('should throw NotFoundError when updating a non-existent user', async () => {
    mockRepository.read.mockResolvedValueOnce(null)

    await expect(
      userService.update(
        '123e4567-e89b-12d3-a456-426614174000',
        updatedMockUser
      )
    ).rejects.toThrow(NotFoundError)
    expect(mockRepository.update).not.toHaveBeenCalled()
  })

  it('should delete a user successfully', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'John',
      age: 25,
      hobbies: ['gaming'],
    }
    mockRepository.read.mockResolvedValueOnce(user)
    mockRepository.delete.mockResolvedValueOnce(true)

    const result = await userService.delete(user.id)

    expect(result).toBe(true)
    expect(mockRepository.delete).toHaveBeenCalledWith(user.id)
  })

  it('should throw InvalidInputError when deleting a user with invalid ID', async () => {
    await expect(userService.delete('invalid-id')).rejects.toThrow(
      InvalidInputError
    )
    expect(mockRepository.delete).not.toHaveBeenCalled()
  })

  it('should throw NotFoundError when deleting a non-existent user', async () => {
    mockRepository.read.mockResolvedValueOnce(null)

    await expect(
      userService.delete('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow(NotFoundError)
    expect(mockRepository.delete).not.toHaveBeenCalled()
  })
})
