import {Worker} from 'node:cluster'
import {User} from '../../models/user'
import {IRepository} from '../../repository/repository'
import {IPCAction} from '../../repository/UserRepositoryIPC'

export const initWorker = (worker: Worker, storage: IRepository<User>) => {
  worker.on('message', async (message) => {
    const {action, id, payload} = message

    console.log(
      'Message from worker: %s,',
      action,
      'with process id:',
      worker.process.pid
    )
    switch (action) {
      case IPCAction.CREATE:
        await storage.create({
          ...payload,
          id: payload.id,
        })
        break
      case IPCAction.READ:
        const item = await storage.read(id)
        worker.send({action: IPCAction.READ, id, payload: item || null})
        break
      case IPCAction.DELETE:
        const isDeleted = await storage.delete(id)
        worker.send({action: IPCAction.DELETE, id, success: isDeleted})
        break
      case IPCAction.FIND_ALL:
        const items = await storage.findAll()
        worker.send({action: IPCAction.FIND_ALL, payload: items})
        break
      case IPCAction.UPDATE:
        await storage.update(id, payload)
        worker.send({action: IPCAction.UPDATE, id, payload})
        break
    }
  })
}
