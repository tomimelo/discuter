import httpContext from 'express-http-context'
import cors from 'cors'
import { MadServerConfig } from 'mad-server'
import { expressMadLogger } from 'express-mad-logger'
import serverRouter from './api/routes/api.routes'
import { normalizePort } from './utils/normalizer'
import { loggerAcquirer } from './utils/acquirers/logger-acquirer'
import exceptionHandler from './api/middlewares/exceptionHandler'

const port = normalizePort(process.env.PORT, 3000)

const log = loggerAcquirer.acquire()
const logger = log.child('HttpServer')

export const serverConfig: MadServerConfig = {
  port,
  router: serverRouter,
  logger,
  preMiddlewares: [
    httpContext.middleware,
    cors(),
    expressMadLogger.getMiddleware(log)
  ],
  postMiddlewares: [
    exceptionHandler.internal
  ]
}
