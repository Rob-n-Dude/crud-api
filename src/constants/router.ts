export enum UserRoutes {
  USERS = '/api/users',
  USER = '/api/users/:id',
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export type KnownRoute = UserRoutes
