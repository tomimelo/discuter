import { Message } from "./message"
import { Participant } from "./participant"

export interface Room {
  link: string | null,
  uniqueName: string,
  createdBy: string,
  isOwn: boolean,
  participants: Participant[],
  messages: Message[]
}

export interface UserRoom {
  uniqueName: string,
  createdBy: string,
  participantsCount: number
}

export interface RoomLink {
  id: number,
  link_id: string,
  room_name: string,
  created_by: string
}

export interface RoomEvents {
  'messageAdded': Message,
  'participantJoined': Participant,
  'participantLeft': Participant,
  'roomRemoved': undefined,
  'roomLinkUpdated': string | null,
  'typingStarted': Participant,
  'typingEnded': Participant
}

export type RoomEventType = 'messageAdded' | 'participantJoined' | 'participantLeft' | 'roomRemoved' | 'roomLinkUpdated' | 'typingStarted' | 'typingEnded'
export interface RoomEvent<E extends keyof RoomEvents> {
  type: E,
  data: RoomEvents[E]
}

export interface RoomSettings {
  sounds?: {
    newMessage: boolean,
    userJoin: boolean
  }
}