import twilio from 'twilio'
import AccessToken from 'twilio/lib/jwt/AccessToken'
import { TwilioConfig } from './twilio-config'

export class TwilioClient {
  public constructor (private readonly config: TwilioConfig) {}

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
