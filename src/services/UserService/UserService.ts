import {User} from 'models/user'
import {randomUUID} from 'node:crypto'
import {IRepository} from '../../repository/repository'
import {InvalidInputError} from '../../utils/errors'
import {userDataValidator} from './userDataValidator'
import {userRepository} from '../../repository/UserRepository'
import {IService} from 'services/service'
import { mapUserDataToDTO } from './mapUserDataToDTO'
import { validate } from 'uuid'

class UserService implements IService<User> {
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

  getAll = async () => {
    const users = await this.repository.findAll()
    return users
  }

  getById = async (id: string) => {
    const isIdValid = validate(id) 

    console.log('isIdValid', isIdValid)
    if (!isIdValid) {
      throw new InvalidInputError()
    }

    const user = await this.repository.read(id)

    if (!user) {
      return null
    }

    return user
  }
}

export const userService = new UserService(userRepository)
