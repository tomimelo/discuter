import { Message } from "./message"
import { Participant } from "./participant"

export type ChatEventType = 'message' | 'joined'

export interface ChatEvent {
  type: ChatEventType,
  dateCreated?: Date,
  data: Message | Participant[]
}