import { loggerAcquirer } from '../utils/acquirers/logger-acquirer'
import { twilioClientAcquirer } from '../utils/acquirers/twilio-client-acquirer'
import { TwilioClient } from './twilio-client'
import { TwilioController } from './twilio-controller'

export class TwilioFactory {
  public constructor () {}

  public getClient (): TwilioClient {
    return twilioClientAcquirer.acquire()
  }

  public getController (): TwilioController {
    const logger = loggerAcquirer.acquire().child('TwilioController')
    return new TwilioController(this.getClient(), logger)
  }
}
