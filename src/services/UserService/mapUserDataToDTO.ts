import { User } from "models/user";

export const mapUserDataToDTO = (data: Partial<User>): Partial<User> => {
  const { username, hobbies, age } = data

  return {
    username,
    hobbies,
    age
  }
}