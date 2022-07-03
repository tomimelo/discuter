import twilio, { Twilio } from 'twilio'
import AccessToken from 'twilio/lib/jwt/AccessToken'
import { TwilioConfig } from './twilio-config'

export class TwilioClient {
  private client: Twilio
  public constructor (private readonly config: TwilioConfig) {
    this.client = twilio(this.config.accountSid, this.config.authToken)
  }

  public getAccessTokenWithGrant (identity: string): string {
    const accessToken = this.getAccessToken(identity)
    accessToken.addGrant(this.getConversationGrant())
    return accessToken.toJwt()
  }

  private getAccessToken (identity: string): AccessToken {
    const { AccessToken } = twilio.jwt
    return new AccessToken(this.config.accountSid, this.config.apiKey, this.config.apiSecret, { identity })
  }

  private getConversationGrant (): AccessToken.ChatGrant {
    const { ChatGrant } = twilio.jwt.AccessToken
    return new ChatGrant({
      serviceSid: this.config.serviceSid
    })
  }
}
