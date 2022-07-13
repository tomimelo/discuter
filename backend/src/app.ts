import 'dotenv/config'
import { MadServer } from 'mad-server'
import { ApplicationRunner } from './lib/runner/application-runner/application-runner'
import { loggerAcquirer } from './utils/acquirers/logger-acquirer'
import { serverConfig } from './config'

const environment = process.env.NODE_ENV

const httpServer = new MadServer(serverConfig)
const logger = loggerAcquirer.acquire()

async function startFunction (): Promise<void> {
  logger.info(`Starting app with environment: ${environment}`)
  await httpServer.start()
}

try {
  new ApplicationRunner().run(startFunction)
} catch (error: any) {
  logger.error(error.message)
  process.exit(1)
}
