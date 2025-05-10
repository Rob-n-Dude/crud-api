import {userController} from '../controllers/UserController'
import {Method, UserRoutes} from '../constants/router'
import {IRouter} from './router'

export const withUserRouter = (router: IRouter): IRouter => {
  router.addRoute(UserRoutes.USERS, Method.GET, userController.getAll)

  return router
}
