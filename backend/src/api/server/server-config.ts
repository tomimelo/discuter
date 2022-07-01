import config from 'config'
import cors from 'cors'
import { MadServerConfig } from 'mad-server'
import { expressMadLogger } from 'express-mad-logger'
import { AppConfig } from '../../config'
import serverRouter from '../routes/api.routes'
import { normalizePort } from '../../utils/normalizer'
import { loggerAcquirer } from '../../utils/logger-acquirer/logger-acquirer'
import exceptionHandler from '../middlewares/exceptionHandler'

const configPort = config.get<AppConfig['api']>('api').port
const port = normalizePort(process.env.PORT, configPort)

const log = loggerAcquirer.acquire()
const logger = log.child('HttpServer')

export const serverConfig: MadServerConfig = {
  port,
  router: serverRouter,
  logger,
  preMiddlewares: [
    cors(),
    expressMadLogger.getMiddleware(log)
  ],
  postMiddlewares: [
    exceptionHandler.internal
  ],
  routePrinter: (routes) => console.log('CONFIGURED ROUTES ===>', routes)
}
