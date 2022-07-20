import twilio, { Twilio } from 'twilio'
import AccessToken from 'twilio/lib/jwt/AccessToken'
import { ChannelInstance } from 'twilio/lib/rest/chat/v2/service/channel'
import { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant'
import { Room } from '../types/room'
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

  public async getRoomsByUser (username: string): Promise<Room[]> {
    const allChannels = await this.client.chat.services(this.config.serviceSid).channels.list()
    const user = await this.client.conversations.users.get(username)
    const userConversationsList = await user.userConversations.list()
    const channelsMap = allChannels.reduce<Record<string, ChannelInstance>>((acc: Record<string, ChannelInstance>, channel) => {
      acc[channel.sid] = channel
      return acc
    }, {})
    return userConversationsList.map(userConversation => {
      return {
        uniqueName: userConversation.uniqueName,
        createdBy: userConversation.createdBy,
        participantsCount: channelsMap[userConversation.conversationSid]?.membersCount
      }
    })
  }

  public async addUserToConversation (uniqueName: string, identity: string): Promise<ParticipantInstance> {
    return this.client.conversations.conversations(uniqueName).participants.create({
      identity
    })
  }

  public async removeAllConversations (): Promise<void> {
    const conversations = await this.client.conversations.conversations.list()
    await Promise.all(conversations.map(conversation => {
      return conversation.remove()
    }))
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
