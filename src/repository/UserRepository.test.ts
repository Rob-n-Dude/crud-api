import {User} from 'models/user'
import {UserRepository} from './UserRepository'

describe('UserRepository', () => {
  let userRepository: UserRepository

  beforeEach(() => {
    userRepository = new UserRepository()
  })

  it('should create a user', async () => {
    const user = {id: '1', username: 'John Doe'} as User

    await userRepository.create(user)

    const storedUser = await userRepository.read('1')
    expect(storedUser).toEqual(user)
  })

  it('should read a user', async () => {
    const user = {id: '2', username: 'Jane Doe'} as User

    await userRepository.create(user)

    const storedUser = await userRepository.read('2')
    expect(storedUser).toEqual(user)
  })

  it('should delete a user', async () => {
    const user = {id: '3', username: 'Jim Doe'} as User

    await userRepository.create(user)

    const isDeleted = await userRepository.delete('3')
    expect(isDeleted).toBe(true)

    const storedUser = await userRepository.read('3')
    expect(storedUser).toBeNull()
  })

  it('should find all users', async () => {
    const users = [
      {id: '4', username: 'Jack Doe'},
      {id: '5', username: 'Jill Doe'},
    ] as User[]

    for (const user of users) {
      await userRepository.create(user)
    }

    const allUsers = await userRepository.findAll()
    expect(allUsers).toEqual(users)
  })

  it('should update a user', async () => {
    const user = {id: '6', username: 'Jake Doe'} as User
    await userRepository.create(user)

    const updatedUser = {id: '6', username: 'Jake Smith'} as User
    await userRepository.update('6', updatedUser)

    const storedUser = await userRepository.read('6')
    expect(storedUser).toEqual(updatedUser)
  })
})
