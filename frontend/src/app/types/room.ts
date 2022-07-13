import { Message } from "./message"
import { Participant } from "./participant"

export interface Room {
  id: string,
  uniqueName: string,
  createdBy: string,
  participants: Participant[]
  messages: Message[]
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