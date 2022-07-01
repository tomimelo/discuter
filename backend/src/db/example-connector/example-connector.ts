import { Logger } from '../../types/logger'
import { loggerAcquirer } from '../../utils/logger-acquirer/logger-acquirer'
import { DatabaseConnector } from '../database-connector'
import { ExampleConnectorConfig } from './example-connector-config'

export class ExampleConnector implements DatabaseConnector {
  private logger: Logger
  public constructor (private readonly config: ExampleConnectorConfig) {
    this.logger = loggerAcquirer.acquire().child('ExampleConnector')
  }

  public async connect (): Promise<void> {
    this.logger.info('Connecting to database...')
    // Here you need to implement de actual db connection
    // await dbDriver.connect(this.config)
    setTimeout(async () => {
      this.logger.info('✓ Database connected')
      await this.setup()
    }, 2000)
  }

  private async setup (): Promise<void> {
    this.logger.info('Setting up database...')
    // Here you can initialize the db with some data if you need to
    this.logger.info('✓ Database set up completed')
  }
}
