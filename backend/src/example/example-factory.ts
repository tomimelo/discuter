import { Repository } from '../db/repository'
import { loggerAcquirer } from '../utils/logger-acquirer/logger-acquirer'
import { Example } from './example'
import { ExampleController } from './example-controller'
import { ExampleRepository } from './example-repository'
import { ExampleService } from './example-service'

export class ExampleFactory {
  public getController (): ExampleController {
    const logger = loggerAcquirer.acquire().child('ExampleController')
    return new ExampleController(this.getService(), logger)
  }

  public getService (): ExampleService {
    return new ExampleService(this.getRepository())
  }

  public getRepository (): Repository<Example> {
    return new ExampleRepository()
  }
}
