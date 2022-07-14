import { Injectable } from '@angular/core';
import { Conversation, Message as TwilioMessage, Participant as TwilioParticipant } from '@twilio/conversations';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../types/message';
import { Participant } from '../types/participant';
import { Room, RoomEvent, RoomUpdate } from '../types/room';
import { TwilioService } from './twilio.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private room$: BehaviorSubject<Room | null> = new BehaviorSubject<Room | null>(null)
  public onChanges = new Subject<RoomUpdate<RoomEvent>>()

  constructor(private twilioService: TwilioService) {
    this.listenConversation()
    this.listenOnConversationEvents()
  }

  public getRoom(): Observable<Room | null> {
    return this.room$.asObservable()
  }

  public isUserInRoom(): boolean {
    return this.twilioService.isClientOnConversation()
  }

  public async sendMessage(message: string): Promise<void> {
    await this.twilioService.sendMessage(message)
  }

  public async joinRoom(room: string): Promise<void> {
    await this.twilioService.joinRoom(room)
  }

  public leaveRoom(): void {
    this.twilioService.destroyConversation()
  }

  public async abandonRoom(): Promise<void> {
    this.twilioService.leaveConversation()
  }

  public async deleteRoom(): Promise<void> {
    await this.twilioService.deleteConversation()
  }

  public async inviteParticipant(username: string): Promise<void> {
    await this.twilioService.inviteParticipant(username)
  }

  private listenConversation(): void {
    this.twilioService.getConversation().subscribe(async conversation => {
      await this.updateRoom(conversation)
    })
  }

  private listenOnConversationEvents(): void {
    this.twilioService.onConversationEvent.subscribe(event => {
      switch (event.type) {
        case 'messageAdded':
          this.onChanges.next({
            type: event.type,
            data: this.createMessage(event.data as TwilioMessage)
          })
          break
        case 'participantJoined':
          this.onChanges.next({
            type: event.type,
            data: this.createParticipant(event.data as TwilioParticipant)
          })
          break
        case 'participantLeft':
          this.onChanges.next({
            type: event.type,
            data: this.createParticipant(event.data as TwilioParticipant)
          })
          break
      }
    })
  }

  private async updateRoom(conversation: Conversation | null): Promise<void> {
    const room = conversation 
    ? {
      link: await this.getRoomLink(conversation),
      uniqueName: conversation.uniqueName || '',
      createdBy: conversation.createdBy,
      participants: await this.setParticipants(conversation),
      messages: await this.setMessages(conversation)
    } : null
    this.room$.next(room)
  }

  private async getRoomLink(conversation: Conversation): Promise<string | null> {
    const attributes = await conversation.getAttributes()
    if (!attributes) return null
    const jsonAttributes = JSON.parse(JSON.stringify(attributes))
    const roomLinkId = jsonAttributes.roomLinkId
    return roomLinkId ? this.buildRoomLink(roomLinkId) : null
  }

  private buildRoomLink(roomLinkId: string): string {
    return `${environment.baseUrl}/invite/${roomLinkId}`
  }

  private async setParticipants(conversation: Conversation): Promise<Participant[]> {
    const participants = await conversation.getParticipants()
    return participants.map(participant => this.createParticipant(participant))
  }

  private async setMessages(conversation: Conversation): Promise<Message[]> {
    const messages = await conversation.getMessages()
    return messages.items.map(message => this.createMessage(message))
  }

  private createParticipant(participant: TwilioParticipant): Participant {
    return participant
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
