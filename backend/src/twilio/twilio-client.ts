import twilio, { Twilio } from 'twilio'
import AccessToken from 'twilio/lib/jwt/AccessToken'
import { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant'
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

  public async getRoomsByUser (username: string): Promise<any[]> {
    // const channels = await this.client.chat.services(this.config.serviceSid).channels.list()
    const user = await this.client.conversations.users.get(username)
    const userConversationsList = await user.userConversations.list()
    return userConversationsList.map(userConversation => {
      return {
        uniqueName: userConversation.uniqueName,
        createdBy: userConversation.createdBy,
        conversationState: userConversation.conversationState,
        unreadMessagesCount: userConversation.unreadMessagesCount,
        dateCreated: userConversation.dateCreated,
        dateUpdated: userConversation.dateUpdated
      }
    })
  }

  public async addUserToConversation (uniqueName: string, identity: string): Promise<ParticipantInstance> {
    return this.client.conversations.conversations(uniqueName).participants.create({
      identity
    })
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
