import {appRouter as router} from './router'
import {withUserRouter} from './userRouter'

export const appRouter = withUserRouter(router)
