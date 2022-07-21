import { Media, MessageType } from "@twilio/conversations";
import { Participant } from "./participant";

export interface Message {
  id: string,
  author: Participant,
  type: MessageType,
  body: string | null,
  media: MessageMedia | null,
  dateCreated: Date,
  isOwn: boolean
}

export interface MessageMedia {
  contentType: string,
  url: string
}
