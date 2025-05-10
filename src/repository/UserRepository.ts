import {User} from 'models/user'
import {IRepository} from './repository'

class UserRepository implements IRepository<User> {
  private storage = new Map<string, User>()

  create = async (item: User) => {
    const {id} = item
    this.storage.set(id, item)
  }

  read = async (id: string) => {
    const storedUser = this.storage.get(id) || null

    return storedUser
  }

  delete = async (id: string) => {
    const isDeleted = this.storage.delete(id)

    return isDeleted
  }

  findAll = async () => {
    return [...this.storage.values()]
  }

  update = async (id: string, item: User) => {
    this.storage.set(id, item)
    return item
  }
}

export const userRepository = new UserRepository()
