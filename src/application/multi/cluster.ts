import cluster, {Worker} from 'node:cluster'
import {availableParallelism} from 'node:os'
import {roundRobin} from './balancer'
import {ENV} from '../../utils/env'
import {createServer, IncomingMessage, request} from 'node:http'

import {UserRepository} from '../../repository/UserRepository'
import {initWorker} from './initWorker'

const setupBalancer = (
  port: string | number,
  workers: Record<string, Worker>,
  nextIdGenerator: Iterator<number>
) => {
  const loadBalancer = createServer()
  loadBalancer.on('request', (req, res) => {
    const nextWorkerId = nextIdGenerator.next().value
    const [workerPort] = Object.entries(workers).at(nextWorkerId)!

    const proxyOptions = {
      port: Number(workerPort),
      path: req.url,
      method: req.method,
      headers: req.headers,
    }

    const proxy = request(proxyOptions, (proxyResponse: IncomingMessage) => {
      res.writeHead(proxyResponse.statusCode!, proxyResponse.headers)
      proxyResponse.pipe(res)
    })

    req.pipe(proxy)
  })

  loadBalancer.listen(port, () => {
    console.log('Balancer runs at %s port', port)
  })
}

if (!cluster.isPrimary) {
  import('./worker')
} else {
  const BALANCER_PORT = ENV.PORT ?? 4000
  const storage = new UserRepository()

  const availableWorkers = availableParallelism() - 1
  const roundRobinOrderGenerator = roundRobin(availableWorkers)

  const workers: Record<string, Worker> = {}

  for (let i = 0; i < availableWorkers; i++) {
    const port = +BALANCER_PORT + 1 + i
    const worker = cluster.fork({WORKER_PORT: port})
    workers[port] = worker
  }

  for (const worker of Object.values(workers!)) {
    initWorker(worker, storage)
  }

  cluster.on('exit', (worker: Worker) => {
    const [port] = Object.entries(workers).find(
      ([, w]) => w.process.pid === worker.process.pid
    )!
    const workerReplacement = cluster.fork({WORKER_PORT: port})
    workers[port] = workerReplacement

    initWorker(workerReplacement, storage)
  })

  setupBalancer(BALANCER_PORT, workers, roundRobinOrderGenerator)
}
