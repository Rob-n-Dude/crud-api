import {userDataValidator} from './userDataValidator'
import {User} from 'models/user'

describe('userDataValidator', () => {
  describe('return true', () => {
    it('should return true for valid user data', () => {
      const userData = {
        username: 'John Doe',
        age: 30,
        hobbies: ['reading', 'gaming'],
      } as User

      const result = userDataValidator(userData)
      expect(result).toBe(true)
    })
  })

  describe('return false', () => {
    const testCases = [
      {
        description: 'should return false for missing username',
        userData: {
          age: 30,
          hobbies: ['reading', 'gaming'],
        } as User,
        expected: false,
      },
      {
        description: 'should return false for username not being a string',
        userData: {
          username: 123,
          age: 30,
          hobbies: ['reading', 'gaming'],
        } as unknown as User,
        expected: false,
      },
      {
        description: 'should return false for missing age',
        userData: {
          username: 'John Doe',
          hobbies: ['reading', 'gaming'],
        } as User,
        expected: false,
      },
      {
        description: 'should return false for age not being a number',
        userData: {
          username: 'John Doe',
          age: '30',
          hobbies: ['reading', 'gaming'],
        } as unknown as User,
        expected: false,
      },
      {
        description: 'should return false for age being negative',
        userData: {
          username: 'John Doe',
          age: -5,
          hobbies: ['reading', 'gaming'],
        } as User,
        expected: false,
      },
      {
        description: 'should return false for missing hobbies',
        userData: {
          username: 'John Doe',
          age: 30,
        } as User,
        expected: false,
      },
      {
        description: 'should return false for hobbies not being an array',
        userData: {
          username: 'John Doe',
          age: 30,
          hobbies: 'reading',
        } as unknown as User,
        expected: false,
      },
    ]

    testCases.forEach(({description, userData, expected}) => {
      it(description, () => {
        const result = userDataValidator(userData)
        expect(result).toBe(expected)
      })
    })
  })
})
