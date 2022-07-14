import { Message } from "./message"
import { Participant } from "./participant"

export interface Room {
  link: string | null,
  uniqueName: string,
  createdBy: string,
  isOwn: boolean,
  participants: Participant[]
  messages: Message[]
}

export interface RoomLink {
  id: string,
  unique_name: string,
  user: string
}

interface RoomEvents {
  'messageAdded': Message,
  'participantJoined': Participant,
  'participantLeft': Participant
}

export type RoomEvent = 'messageAdded' | 'participantJoined' | 'participantLeft'
export interface RoomUpdate<E extends keyof RoomEvents> {
  type: E,
  data: RoomEvents[E]
}