import { Injectable } from '@angular/core';
import { Client, Conversation, Message, Participant, State } from '@twilio/conversations';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';

interface ConversationEvents {
  'messageAdded': Message,
  'participantJoined': Participant,
  'participantLeft': Participant,
  'removed': Conversation
}

export type ConversationEvent = 'messageAdded' | 'participantJoined' | 'participantLeft' | 'removed'
export interface ConversationUpdate<E extends keyof ConversationEvents> {
  type: E,
  data: ConversationEvents[E]
}

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private client: Client | null = null
  private conversation: Conversation | null = null
  private conversation$: BehaviorSubject<Conversation | null> = new BehaviorSubject<Conversation | null>(null)
  public onConversationEvent = new Subject<ConversationUpdate<ConversationEvent>>()

  constructor(private apiService: ApiService) { }

  public async joinRoom(room: string): Promise<void> {
    try {
      const conversation = await this.getConversationByUniqueName(room) || await this.createConversation(room)
      if (conversation.status !== 'joined') {
        await conversation.join()
      }
      this.setConversation(conversation)
      this.listenOnConversation()
    } catch (error) {
      if (this.isForbidden(error)) {
        throw new Error("You don't have permission to join this room")
      }
      throw new Error('Something went wrong, please try again')
    }
  }

  public async sendMessage(message: string): Promise<void> {
    await this.conversation?.sendMessage(message)
  }

  public destroyConversation() {
    this.unsubscribeConversation()
    this.setConversation(null)
  }

  public async leaveConversation() {
    this.unsubscribeConversation()
    await this.conversation?.leave()
    this.setConversation(null)
  }

  public async deleteConversation() {
    return this.conversation?.delete()
  }

  public getConversation(): Observable<Conversation | null> {
    return this.conversation$.asObservable()
  }

  public async inviteParticipant(identity: string): Promise<void> {
    try {
      await this.conversation?.add(identity)
    } catch (error) {
      if (this.isForbidden(error)) {
        throw new Error("You don't have permission to invite this user")
      } else if (this.isConflict(error)) {
        throw new Error(`User ${identity} is already in this conversation`)
      } else if (this.isBadRequest(error)) {
        throw new Error(`User ${identity} not found`)
      }
      throw new Error('Something went wrong, please try again')
    }
  }

  public async removeParticipant(identity: string): Promise<void> {
    try {
      await this.conversation?.removeParticipant(identity)
    } catch (error) {
      if (this.isForbidden(error)) {
        throw new Error("You don't have permission to remove this user")
      } else if (this.isConflict(error)) {
        throw new Error(`User ${identity} is not in this conversation`)
      } else if (this.isBadRequest(error)) {
        throw new Error(`User ${identity} not found`)
      }
      throw new Error('Something went wrong, please try again')
    }
  }

  public getUserIdentity(): string | null {
    return this.client?.user.identity || null
  }

  public isClientOnConversation(): boolean {
    return this.conversation?.status === 'joined'
  }

  private listenOnConversation() {
    this.conversation?.on('messageAdded', (message: Message) => {
      this.onConversationEvent.next({
        type: 'messageAdded',
        data: message
      })
    })
    this.conversation?.on('participantJoined', (participant: Participant) => {
      this.onConversationEvent.next({
        type: 'participantJoined',
        data: participant
      })
    })
    this.conversation?.on('participantLeft', (participant: Participant) => {
      this.onConversationEvent.next({
        type: 'participantLeft',
        data: participant
      })
    })
    this.conversation?.on('removed', (conversation: Conversation) => {
      this.onConversationEvent.next({
        type: 'removed',
        data: conversation
      })
    })
  }

  private async getClient(): Promise<Client> {
    return this.client && this.client.connectionState === 'connected' ? this.client : await this.initClient()
  }

  private async initClient(): Promise<Client> {
    if (this.client) {
      await this.client.shutdown()
      this.client = null
    }
    return new Promise<Client>((resolve, reject) => {
      this.apiService.getAccessToken().subscribe({next: accessToken => {
        const client = new Client(accessToken)
        client.on('stateChanged', async (state: State) => {
          if (state === 'initialized') {
            this.client = client
            resolve(this.client)
          }
          if (state === 'failed') {
            this.client = null
            reject(new Error('Failed to initialize client'))
          }
        })
      }, error: err => {
        reject(err)
      }})
    })
  }

  private async getConversationByUniqueName(uniqueName: string): Promise<Conversation | null> {
    try {
      const client = await this.getClient()
      const conversation = await client.getConversationByUniqueName(uniqueName)
      return conversation
    } catch (error: any) {
      if (this.isNotFound(error)) {
        return null
      }
      throw error
    }
  }

  private async createConversation(uniqueName: string): Promise<Conversation> {
    const client = await this.getClient()
    return new Promise<Conversation>((resolve, reject) => {
      this.apiService.createRoomLink(uniqueName).subscribe({next: async roomLink => {
        const {id} = roomLink
        const conversationCreated = await client.createConversation({uniqueName, attributes: {roomLinkId: id}})
        resolve(conversationCreated)
      }, error: err => {
        reject(err)
      }})
    })
  }

  private unsubscribeConversation(): void {
    this.conversation?.removeAllListeners()
  }

  private isConflict(error: any): boolean {
    return error.status === 409 || error.message.includes('Conflict')
  }

  private isForbidden(error: any): boolean {
    return error.status === 403 || error.message.includes('Forbidden')
  }

  private isNotFound(error: any): boolean {
    return error.status === 404 || error.message.includes('Not Found')
  }

  private isBadRequest(error: any): boolean {
    return error.status === 400 || error.message.includes('Bad Request')
  }

  private setConversation(value: Conversation | null): void {
    this.conversation = value
    this.conversation$.next(value)
  }
}
