import { Injectable } from '@angular/core';
import { Conversation, Message as TwilioMessage } from '@twilio/conversations';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../types/message';
import { Participant } from '../types/participant';
import { Room } from '../types/room';
import { TwilioService } from './twilio.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private room: Room | null = null
  private room$: BehaviorSubject<Room | null> = new BehaviorSubject<Room | null>(null)
  public onMessage = new Subject<Message>()

  constructor(private twilioService: TwilioService) {
    this.listenConversation()
  }

  private listenConversation() {
    this.twilioService.getConversation().subscribe(async conversation => {
      await this.updateRoom(conversation)
    })
  }

  private async updateRoom(conversation: Conversation | null) {
    if (conversation) {
      this.room = {
        id: '',
        uniqueName: conversation.uniqueName || '',
        participants: await this.setParticipants(conversation),
        messages: await this.setMessages(conversation)
      }
    } else {
      this.room = null
    }
    this.room$.next(this.room)
  }

  private async setParticipants(conversation: Conversation): Promise<Participant[]> {
    return await conversation.getParticipants()
  }

  private async setMessages(conversation: Conversation): Promise<Message[]> {
    const messages = await conversation.getMessages()
    return messages.items.map(message => this.createMessage(message))
  }

  private createMessage(message: TwilioMessage): Message {
    return {
      author: message.author || '',
      body: message.body,
      dateCreated: message.dateCreated!,
      isOwn: message.author === this.twilioService.getUserIdentity()
    }
  }
}
