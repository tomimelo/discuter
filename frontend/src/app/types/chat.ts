import { Message } from "./message"
import { Participant } from "./participant"

export type ChatEventType = 'message' | 'joined'

export interface ChatEvent {
  type: ChatEventType,
  data: Message | Participant[]
}