import { Injectable } from '@angular/core';
import { Conversation, Media, Message as TwilioMessage, Participant as TwilioParticipant } from '@twilio/conversations';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagerMessage } from '../components/messager/messager.component';
import { Message } from '../types/message';
import { Participant } from '../types/participant';
import { Room, RoomEventType, RoomSettings, RoomEvent, UserRoom } from '../types/room';
import { ApiService } from './api.service';
import { ConversationEvents, TwilioService } from './twilio.service';

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
  private destroy$ = new Subject<void>()

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

  public async sendMessage(message: MessagerMessage): Promise<void> {
    if (message.type === 'text') {
      await this.twilioService.sendTextMessage(message.body!)
    } else if (message.type === 'media') {
      await this.twilioService.sendMediaMessage('audio/webm', message.media!)
    } else {
      throw new Error('Unknown message type')
    }
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

  public typing(): void {
    this.twilioService.typing()
  }

  public getUserRooms(): Observable<UserRoom[]> {
    return this.apiService.getUserRooms()
  }

  private listenConversation(): void {
    this.twilioService.getConversation().pipe(takeUntil(this.destroy$)).subscribe(async conversation => {
      await this.updateRoom(conversation)
    })
  }

  private listenOnConversationEvents(): void {
    this.twilioService.onConversationEvent.pipe(takeUntil(this.destroy$)).subscribe(async event => {
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
        case 'updated':
          this.onConversationUpdated(event.data as ConversationEvents['updated'])
          break
        case 'typingStarted':
          this.onChanges.next({
            type: event.type,
            data: this.createParticipant(event.data as TwilioParticipant)
          })
          break
        case 'typingEnded':
          this.onChanges.next({
            type: event.type,
            data: this.createParticipant(event.data as TwilioParticipant)
          })
          break
      }
    })
  }

  private async onConversationUpdated(data: ConversationEvents['updated']) {
    await this.updateRoom(data.conversation)
    if (data.updateReasons.includes('attributes')) {
      this.onChanges.next({
        type: 'roomLinkUpdated',
        data: await this.getRoomLink(data.conversation),
      })
    }
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

  private createParticipantFromMessage(message: TwilioMessage): Participant {
    const jsonAttributes = JSON.parse(JSON.stringify(message.attributes))
    return {
      username: message.author!,
      avatarUrl: jsonAttributes.author?.avatar_url || null
    }
  }

  private async createMessage(message: TwilioMessage): Promise<Message> {
    const participant = await this.getParticipantFromMessage(message)
    return {
      author: participant,
      type: message.type,
      body: message.body,
      media: await this.getMessageMedia(message.attachedMedia),
      dateCreated: message.dateCreated!,
      isOwn: message.author === this.twilioService.getUserIdentity()
    }
  }

  private async getMessageMedia(media: Media[] | null): Promise<string | null> {
    if (this.isMediaEmpty(media)) return null
    const mediaUrl = await media![0].getContentTemporaryUrl()
    return mediaUrl
  }

  private isMediaEmpty(media: Media[] | null): boolean {
    return !media || media.length === 0
  }

  private async getParticipantFromMessage(message: TwilioMessage): Promise<Participant> {
    try {
      const participant = await message.getParticipant()
      return this.createParticipant(participant)
    } catch (error) {
      return this.createParticipantFromMessage(message)
    }
  }
}
