import config from 'config'
import { MadServer } from 'mad-server'
import { serverConfig } from './api/server/server-config'
import { AppConfig } from './config'
import { ApplicationRunner } from './lib/runner/application-runner/application-runner'
import { loggerAcquirer } from './utils/logger-acquirer/logger-acquirer'
import { ExampleConnector } from './db/example-connector/example-connector'
import { ExampleConnectorConfig } from './db/example-connector/example-connector-config'

const dbConfig = config.get<AppConfig['db']>('db')
const environment = config.get<AppConfig['env']>('env')

const httpServer = new MadServer(serverConfig)
const logger = loggerAcquirer.acquire()

async function startFunction (): Promise<void> {
  logger.info(`Starting app with environment: ${environment}`)
  await httpServer.start()
  const dbConnectorConfig: ExampleConnectorConfig = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    options: dbConfig.options
  }
  const dbConnector = new ExampleConnector(dbConnectorConfig)
  await dbConnector.connect()
}

try {
  new ApplicationRunner().run(startFunction)
} catch (error: any) {
  logger.error(error.message)
  process.exit(1)
}
