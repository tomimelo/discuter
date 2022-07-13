import { Message } from "./message"
import { Participant } from "./participant"

export interface Room {
  id: string,
  uniqueName: string,
  participants: Participant[]
  messages: Message[]
}