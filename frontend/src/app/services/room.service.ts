import { Injectable } from '@angular/core';
import { Conversation, Message as TwilioMessage, Participant as TwilioParticipant } from '@twilio/conversations';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../types/message';
import { Participant } from '../types/participant';
import { Room, RoomEventType, RoomSettings, RoomEvent } from '../types/room';
import { ApiService } from './api.service';
import { TwilioService } from './twilio.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public onChanges = new Subject<RoomEvent<RoomEventType>>()
  private room$: BehaviorSubject<Room | null> = new BehaviorSubject<Room | null>(null)
  private defaultRoomSettings: RoomSettings = {
    sounds: {
      newMessage: true,
      userJoin: true
    }
  }
  private settings$: BehaviorSubject<RoomSettings> = new BehaviorSubject<RoomSettings>(this.getSettings())

  constructor(private twilioService: TwilioService, private apiService: ApiService) {
    this.listenConversation()
    this.listenOnConversationEvents()
  }

  public getRoom(): Observable<Room | null> {
    return this.room$.asObservable()
  }

  public onSettingsChanges(): Observable<RoomSettings> {
    return this.settings$.asObservable()
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

  public async deleteRoom(room: string): Promise<void> {
    await this.twilioService.deleteConversation()
    return new Promise<void>(async (resolve, reject) => {
      this.apiService.deleteRoomLink(room).subscribe({next: () => {
        resolve()
      }, error: error => {
        reject(error)
      }})
    })
  }

  public async inviteParticipant(username: string): Promise<void> {
    await this.twilioService.inviteParticipant(username)
  }

  public getSettings(): RoomSettings {
    const globalSettings = localStorage.getItem('discuter.settings')
    if (!globalSettings) return this.defaultRoomSettings
    const parsedGlobalSettings = JSON.parse(globalSettings)
    return parsedGlobalSettings.room ? parsedGlobalSettings.room : this.defaultRoomSettings
  }

  public setSettings(settings: RoomSettings) {
    const globalSettings = localStorage.getItem('settings') || '{}'
    const parsedGlobalSettings = JSON.parse(globalSettings)
    parsedGlobalSettings.room = {
      ...parsedGlobalSettings.room,
      ...settings
    }
    localStorage.setItem('discuter.settings', JSON.stringify(parsedGlobalSettings))
    this.settings$.next(parsedGlobalSettings.room)
  }

  public isRoomCodeValid(roomCode: string): boolean {
    return /^\d{5}$/g.test(roomCode)
  }

  private listenConversation(): void {
    this.twilioService.getConversation().subscribe(async conversation => {
      await this.updateRoom(conversation)
    })
  }

  private listenOnConversationEvents(): void {
    this.twilioService.onConversationEvent.subscribe(async event => {
      switch (event.type) {
        case 'messageAdded':
          this.onChanges.next({
            type: event.type,
            data: await this.createMessage(event.data as TwilioMessage)
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
        case 'removed':
          this.onChanges.next({
            type: 'roomRemoved',
            data: undefined
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
      isOwn: conversation.createdBy === this.twilioService.getUserIdentity(),
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
    const paginatedMessages = await conversation.getMessages()
    const messages = await Promise.all(paginatedMessages.items.map(message => this.createMessage(message)))
    return messages.sort((a, b) => a.dateCreated > b.dateCreated ? 1 : -1)
  }

  private createParticipant(participant: TwilioParticipant): Participant {
    const jsonAttributes = JSON.parse(JSON.stringify(participant.attributes))
    return {
      username: participant.identity!,
      dateCreated: participant.dateCreated!,
      avatarUrl: jsonAttributes.avatar_url || null
    }
  }

  private async createMessage(message: TwilioMessage): Promise<Message> {
    const participant = await this.getParticipantFromMessage(message)
    return {
      author: participant,
      body: message.body,
      dateCreated: message.dateCreated!,
      isOwn: message.author === this.twilioService.getUserIdentity()
    }
  }

  private async getParticipantFromMessage(message: TwilioMessage): Promise<Participant> {
    const participant = await message.getParticipant()
    return this.createParticipant(participant)
  }
}
