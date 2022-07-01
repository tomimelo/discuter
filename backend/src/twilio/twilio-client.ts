import twilio from 'twilio'
import AccessToken from 'twilio/lib/jwt/AccessToken'

interface TwilioConfig {
  accountSid: string;
  apiKey: string;
  apiSecret: string;
  serviceSid: string;
}

export class TwilioClient {
  public constructor (private readonly config: TwilioConfig) {}

  private getAccessToken (identity: string): AccessToken {
    const { AccessToken } = twilio.jwt
    return new AccessToken(this.config.accountSid, this.config.apiKey, this.config.apiSecret, { identity })
  }

  private getConversationGrant (identity: string): AccessToken.ChatGrant {
    const { ChatGrant } = twilio.jwt.AccessToken
    return new ChatGrant({
      serviceSid: this.config.serviceSid
    })
  }
}
