export interface IService<T> {
  create: (data: Partial<T>) => Promise<void>
  getAll: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
}
