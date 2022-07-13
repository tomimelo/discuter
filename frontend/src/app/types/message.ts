export interface Message {
  author: string,
  body: string | null,
  dateCreated: Date,
  isOwn: boolean
}
