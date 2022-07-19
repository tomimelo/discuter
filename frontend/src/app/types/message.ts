import { Participant } from "./participant";

export interface Message {
  author: Participant,
  body: string | null,
  dateCreated: Date,
  isOwn: boolean
}
