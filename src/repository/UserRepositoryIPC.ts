import {IRepository} from './repository'
import {User} from 'models/user'

interface IPCMessage {
  action: string
  id?: string
  payload?: User | User[]
  success?: boolean
}

export enum IPCAction {
  CREATE = 'create',
  READ = 'read',
  DELETE = 'delete',
  FIND_ALL = 'findAll',
  UPDATE = 'update',
}

export class UserRepositoryIPC implements IRepository<User> {
  create = async (item: User): Promise<void> => {
    process.send?.({action: IPCAction.CREATE, payload: item})
  }

  read = async (id: string): Promise<User | null> => {
    return new Promise((resolve) => {
      const listener = (message: IPCMessage) => {
        if (message.action === IPCAction.READ && message.id === id) {
          process.off('message', listener)
          resolve(message.payload as User)
        }
      }
      process.on('message', listener)
      process.send?.({action: IPCAction.READ, id})
    })
  }

  delete = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const listener = (message: IPCMessage) => {
        if (message.action === IPCAction.DELETE && message.id === id) {
          process.off('message', listener)
          resolve(message.success as boolean)
        }
      }
      process.on('message', listener)
      process.send?.({action: IPCAction.DELETE, id})
    })
  }

  findAll = async (): Promise<User[]> => {
    return new Promise((resolve) => {
      const listener = (message: IPCMessage) => {
        if (message.action === IPCAction.FIND_ALL) {
          process.off('message', listener)
          resolve(message.payload as User[])
        }
      }
      process.on('message', listener)
      process.send?.({action: IPCAction.FIND_ALL})
    })
  }

  update = async (id: string, item: User): Promise<User> => {
    return new Promise((resolve) => {
      const listener = (message: IPCMessage) => {
        if (message.action === IPCAction.UPDATE && message.id === id) {
          process.off('message', listener)
          resolve(message.payload as User)
        }
      }
      process.on('message', listener)
      process.send?.({action: IPCAction.UPDATE, id, payload: item})
    })
  }
}
