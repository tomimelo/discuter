import { loggerAcquirer } from '../utils/acquirers/logger-acquirer'
import { TwilioClient } from './twilio-client'
import { TwilioConfig } from './twilio-config'
import { TwilioController } from './twilio-controller'

export class TwilioFactory {
  public constructor (private readonly config: TwilioConfig) {}

  public getClient (): TwilioClient {
    return new TwilioClient(this.config)
  }

  public getController (): TwilioController {
    const logger = loggerAcquirer.acquire().child('TwilioController')
    return new TwilioController(this.getClient(), logger)
  }
}
