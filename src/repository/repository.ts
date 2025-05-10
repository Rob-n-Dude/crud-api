export interface IRepository<T> {
  create: (item: T) => Promise<void>
  read: (id: string) => Promise<T | null>
  delete: (id: string) => Promise<boolean>
  findAll: () => Promise<T[]>
  update: (id: string, item: T) => Promise<T>
}
