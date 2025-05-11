import {userController} from '../controllers/UserController'
import {Method, UserRoutes} from '../constants/router'
import {IRouter} from './router'

export const withUserRouter = (router: IRouter): IRouter => {
  router.addRoute(UserRoutes.USERS, Method.GET, userController.getAll)
  router.addRoute(UserRoutes.USERS, Method.POST, userController.create)
  router.addRoute(UserRoutes.USER, Method.GET, userController.getById)
  router.addRoute(UserRoutes.USER, Method.PUT, userController.updateById)

  return router
}
