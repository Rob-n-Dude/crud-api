import {IController} from 'controllers/controller'
import {Method, UserRoutes} from '../constants/router'
import {IRouter} from './router'

export const withUserRouter = (
  router: IRouter,
  controller: IController
): IRouter => {
  router.addRoute(UserRoutes.USERS, Method.GET, controller.getAll)
  router.addRoute(UserRoutes.USERS, Method.POST, controller.create)
  router.addRoute(UserRoutes.USER, Method.GET, controller.getById)
  router.addRoute(UserRoutes.USER, Method.PUT, controller.updateById)
  router.addRoute(UserRoutes.USER, Method.DELETE, controller.deleteById)

  return router
}
