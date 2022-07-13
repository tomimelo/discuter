import { Injectable } from '@angular/core';
import { Conversation, Message as TwilioMessage, Participant as TwilioParticipant } from '@twilio/conversations';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '../types/message';
import { Participant } from '../types/participant';
import { Room, RoomEvent, RoomUpdate } from '../types/room';
import { TwilioService } from './twilio.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private room: Room | null = null
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

  private setRoom(room: Room | null): void {
    this.room = room
    this.room$.next(this.room)
  }

  private listenConversation(): void {
    this.twilioService.getConversation().subscribe(async conversation => {
      await this.updateRoom(conversation)
    })
  }

  private listenOnConversationEvents(): void {
    this.twilioService.onConversationEvent.subscribe(event => {
      if (this.room) {
        switch (event.type) {
          case 'messageAdded':
            this.onMessageAdded(event.data as TwilioMessage)
            break
          case 'participantJoined':
            this.onParticipantJoined(event.data as TwilioParticipant)
            break
          case 'participantLeft':
            this.onParticipantLeft(event.data as TwilioParticipant)
            break
        }
        this.onChanges.next(event)
      }
    })
  }

  private onMessageAdded(message: TwilioMessage): void {
    this.room?.messages.push(this.createMessage(message))
  }

  private onParticipantJoined(participant: TwilioParticipant): void {
    this.room?.participants.push(this.createParticipant(participant))
  }

  private onParticipantLeft(participant: TwilioParticipant): void {
    if (this.room) {
      this.room.participants = this.room?.participants.filter(p => p.username !== participant.identity)
    }
  }

  private async updateRoom(conversation: Conversation | null): Promise<void> {
    const room = conversation 
    ? {
      id: '',
      uniqueName: conversation.uniqueName || '',
      createdBy: conversation.createdBy,
      participants: await this.setParticipants(conversation),
      messages: await this.setMessages(conversation)
    } : null
    this.setRoom(room)
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
