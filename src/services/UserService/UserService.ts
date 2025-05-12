import {User} from 'models/user'
import {randomUUID} from 'node:crypto'
import {IRepository} from '../../repository/repository'
import {InvalidInputError, NotFoundError} from '../../utils/errors'
import {userDataValidator} from './userDataValidator'
import {IService} from 'services/service'
import {mapUserDataToDTO} from './mapUserDataToDTO'
import {validate as isUUID} from 'uuid'

export class UserService implements IService<User> {
  private repository: IRepository<User>

  constructor(repository: IRepository<User>) {
    this.repository = repository
  }

  create = async (data: Partial<User>): Promise<User> => {
    const isValid = userDataValidator(data)

    if (!isValid) {
      throw new InvalidInputError()
    }

    const dataWithValidFields = mapUserDataToDTO(data)
    const id = randomUUID()

    const userData = {
      ...dataWithValidFields,
      id,
    } as User

    await this.repository.create(userData)
    return userData
  }

  getAll = async (): Promise<User[]> => {
    const users = await this.repository.findAll()
    return users
  }

  getById = async (id: string): Promise<User | null> => {
    const isIdValid = isUUID(id)

    if (!isIdValid) {
      throw new InvalidInputError()
    }

    const user = await this.repository.read(id)

    if (!user) {
      return null
    }

    return user
  }

  update = async (id: string, data: Partial<User>): Promise<User> => {
    const isValid = userDataValidator(data)

    if (!isValid) {
      throw new InvalidInputError()
    }

    const dbUser = await this.getById(id)

    if (!dbUser) {
      throw new NotFoundError()
    }

    const dataWithValidFields = mapUserDataToDTO(data)

    const newUser = {
      ...dataWithValidFields,
      id,
    } as User

    await this.repository.update(id, newUser)
    return newUser
  }

  delete = async (id: string): Promise<boolean> => {
    const isValidId = isUUID(id)

    if (!isValidId) {
      throw new InvalidInputError()
    }

    const dbUser = await this.getById(id)

    if (!dbUser) {
      throw new NotFoundError()
    }

    const isDeleted = await this.repository.delete(id)

    return isDeleted
  }
}
