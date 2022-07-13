import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Conversation, Message, Participant, State } from '@twilio/conversations';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ConversationEvents {
  'messageAdded': Message,
  'participantJoined': Participant,
  'participantLeft': Participant
}

export type ConversationEvent = 'messageAdded' | 'participantJoined' | 'participantLeft'
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

  constructor(private http: HttpClient) { }

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
      } else if(this.isBadRequest(error)) {
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

  private getAccessToken(jwt: string): Observable<string> {
    return this.http.get(`${environment.apiUrl}/twilio/access-token`,  { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.accessToken)
      );
  }

  private getAuthorizationHeader(jwt: string): { 'Authorization': string } {
    return {
      'Authorization': `Bearer ${jwt}`
    }
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
      const jwt = JSON.parse(localStorage.getItem('supabase.auth.token') || '').currentSession.access_token;
      this.getAccessToken(jwt).subscribe({next: accessToken => {
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
    return client.createConversation({uniqueName})
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
