import {UserRepository} from '../../repository/UserRepository'
import {ENV} from '../../utils/env'
import {startServer} from '../multi/startServer'
import {UserService} from '../../services/UserService'
import {UserController} from '../../controllers/UserController'
import {Router} from '../../routes/router'
import {withUserRouter} from '../../routes/userRouter'

const PORT = ENV.PORT ?? 4000

const repository = new UserRepository()
const service = new UserService(repository)
const controller = new UserController(service)

const router = withUserRouter(new Router(), controller)

startServer(PORT, router)
