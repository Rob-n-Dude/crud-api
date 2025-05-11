import {User} from 'models/user'

export const userDataValidator = (data: Partial<User>): boolean => {
  const {username, hobbies, age} = data

  if (!username || typeof username !== 'string') {
    return false
  }

  if (typeof age !== 'number' || age < 0) {
    return false
  }

  if (!Array.isArray(hobbies)) {
    return false
  }

  return true
}
