import {User} from 'models/user'
import {randomUUID} from 'node:crypto'
import {IRepository} from '../../repository/repository'
import {InvalidInputError} from '../../utils/errors'
import {userDataValidator} from './userDataValidator'
import {userRepository} from '../../repository/UserRepository'
import {IService} from 'services/service'

class UserService implements IService<User> {
  private repository: IRepository<User>

  constructor(repository: IRepository<User>) {
    this.repository = repository
  }

  create = async (data: Partial<User>) => {
    const isValid = userDataValidator(data)

    if (!isValid) {
      throw new InvalidInputError()
    }
    const id = randomUUID()

    const userData = {
      ...data,
      id,
    } as User

    await this.repository.create(userData)
  }

  getAll = async () => {
    const users = await this.repository.findAll()
    return users
  }

  getById = async (id: string) => {
    const user = await this.repository.read(id)

    if (!user) {
      return null
    }

    return user
  }
}

export const userService = new UserService(userRepository)
