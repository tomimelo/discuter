import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Conversation, Message, Participant, State } from '@twilio/conversations';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private client: Client | null = null
  private conversation: Conversation | null = null
  private $conversation: BehaviorSubject<Conversation | null> = new BehaviorSubject<Conversation | null>(null)

  constructor(private http: HttpClient) { }

  getAccessToken(jwt: string): Observable<string> {
    return this.http.get(`${environment.apiUrl}/twilio/access-token`,  { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.accessToken)
      );
  }

  getAuthorizationHeader(jwt: string) {
    return {
      'Authorization': `Bearer ${jwt}`
    }
  }

  async joinRoom(room: string) {
    try {
      const conversation = await this.getConversationByUniqueName(room) || await this.createConversation(room)
      console.log({ conversation });
      conversation.on('messageAdded', (message: Message) => {
        console.log(message)
      })
      conversation.on('participantJoined', (participant: Participant) => {
        console.log(participant)
      })
      conversation.on('participantLeft', participant => {
        console.log('participantLeft', participant);
      })
      if (conversation.status !== 'joined') {
        await conversation.join()
      }
      this.setConversation(conversation)
      console.log(`Room ${room} joined`);
    } catch (error) {
      if (this.isForbidden(error)) {
        console.log(`Forbidden to join room ${room}`);
      }
      throw error
    }
  }

  async sendMessage(message: string) {
    this.conversation?.sendMessage(message)
  }

  public async leaveRoom() {
    this.conversation?.removeAllListeners()
    if (!this.isHost()) {
      await this.conversation?.leave()
    }
    this.setConversation(null)
  }

  public async deleteRoom() {
    return this.conversation?.delete()
  }

  public getConversation(): Observable<Conversation | null> {
    return this.$conversation.asObservable()
  }

  public async inviteParticipant(identity: string) {
    try {
      const response = await this.conversation?.add(identity)
    } catch (error) {
      if (this.isForbidden(error)) {
        console.log(`Forbidden to invite participant ${identity}`);
      } else if (this.isConflict(error)) {
        console.log(`Participant ${identity} already invited`);
      } else if(this.isBadRequest(error)) {
        console.log(`Participant ${identity} not found`);
      } else {
        console.log("ERROR HERE", error);
      }
      throw error
    }
  }

  private async getClient(): Promise<Client> {
    return this.client || await this.initClient()
  }

  private initClient(): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
      const jwt = JSON.parse(localStorage.getItem('supabase.auth.token') || '').currentSession.access_token;
      this.getAccessToken(jwt).subscribe({next: accessToken => {
        const client = new Client(accessToken)
        client.on('stateChanged', async (state: State) => {
          if (state === 'initialized') {
            this.client = client
            console.log(`Client initialized`);
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
    console.log(`Creating conversation ${uniqueName}`);
    const client = await this.getClient()
    return client.createConversation({uniqueName})
  }

  private isHost(): boolean {
    return this.client?.user.identity === this.conversation?.createdBy
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

  private setConversation(value: Conversation | null) {
    this.conversation = value
    this.$conversation.next(value)
  }
}
