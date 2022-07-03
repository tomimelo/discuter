import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Conversation, Message, State } from '@twilio/conversations';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private conversation: Conversation | null = null

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
    return new Promise<void>((resolve, reject) => {
      try {
        const jwt = JSON.parse(localStorage.getItem('supabase.auth.token') || '').currentSession.access_token;
        this.getAccessToken(jwt).subscribe(accessToken => {
          const client = new Client(accessToken);
          client.on('stateChanged', async (state: State) => {
            if (state === 'initialized') {
              const conversation = await client.getConversationByUniqueName(room)
              console.log(conversation);
              // await conversation.join()
              // this.conversation = conversation
              // this.conversation.on('messageAdded', (message: Message) => {
              //   console.log("New message", message)
              // })
              resolve()
            }
          })
        }, err => {
          reject(err)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async sendMessage(message: string) {
    this.conversation?.sendMessage(message)
  }
}
