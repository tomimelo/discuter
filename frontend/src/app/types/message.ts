import { Media, MessageType } from "@twilio/conversations";
import { Participant } from "./participant";

export interface Message {
  author: Participant,
  type: MessageType,
  body: string | null,
  media: string | null,
  dateCreated: Date,
  isOwn: boolean
}
