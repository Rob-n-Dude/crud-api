export interface IService<T> {
  create: (data: Partial<T>) => Promise<T>,
  getAll: () => Promise<T[]>,
  getById: (id: string) => Promise<T | null>,
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<boolean>
}
