import { TwilioClient } from '../../twilio/twilio-client'
import { TwilioConfig } from '../../twilio/twilio-config'
import { Acquirer } from './acquirer'

class TwilioClientAcquirer implements Acquirer<TwilioClient> {
  private twilioClient: TwilioClient
  public constructor (config: TwilioConfig) {
    this.twilioClient = new TwilioClient(config)
  }

  public acquire (): TwilioClient {
    return this.twilioClient
  }
}

const twilioClientConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  apiKey: process.env.TWILIO_API_KEY || '',
  apiSecret: process.env.TWILIO_API_SECRET || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  serviceSid: process.env.TWILIO_SERVICE_SID || ''
}

export const twilioClientAcquirer = new TwilioClientAcquirer(twilioClientConfig)
