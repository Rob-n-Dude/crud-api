import {startServer} from './startServer'
import {UserService} from '../../services/UserService'
import {UserController} from '../../controllers/UserController'
import {Router} from '../../routes/router'
import {withUserRouter} from '../../routes/userRouter'
import {UserRepositoryIPC} from '../../repository/UserRepositoryIPC'

const port = process.env.WORKER_PORT!

const repository = new UserRepositoryIPC()
const service = new UserService(repository)
const controller = new UserController(service)

const router = withUserRouter(new Router(), controller)

startServer(port, router)
