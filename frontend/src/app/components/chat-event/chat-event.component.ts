import { Component, Input } from '@angular/core';
import { ChatEvent } from 'src/app/types/chat';
import { Participant } from 'src/app/types/participant';

interface SimplifiedEvent {
  author: string,
  header: string,
  date: Date,
  content: string,
  isReversed: boolean,
  isAction: boolean
}

@Component({
  selector: 'app-chat-event',
  templateUrl: './chat-event.component.html',
  styleUrls: ['./chat-event.component.scss']
})
export class ChatEventComponent {

  @Input() set event(event: ChatEvent) {
   this._simplifiedEvent = this.buildSimplifiedEvent(event)
  }
  private _simplifiedEvent!: SimplifiedEvent

  get simplifiedEvent(): SimplifiedEvent {
    return this._simplifiedEvent
  }

  constructor() { }

  private buildSimplifiedEvent(event: any): SimplifiedEvent {
    const isMessage = event.type === 'message'
    return {
      author: this.getEventAuthor(event),
      header: this.getEventHeader(event),
      date: this.getEventDate(event),
      content: this.getEventContent(event),
      isReversed: isMessage ? event.data.isOwn : false,
      isAction: !isMessage
    }
  }

  private getEventAuthor(event: any): string {
    const isMessage = event.type === 'message'
    return isMessage ? event.data.author : event.data[0].username
  }

  private getEventHeader(event: any): string {
    const isMessage = event.type === 'message'
    return isMessage 
      ? event.data.isOwn 
      ? 'You' 
      : event.data.author 
      : event.data[0].username
  }

  private getEventDate(event: any): Date {
    const isMessage = event.type === 'message'
    return isMessage ? event.data.dateCreated : event.data[0].dateCreated
  }

  private getEventContent(event: any): string {
    const isMessage = event.type === 'message'
    if (isMessage) return event.data.body
    return `${event.data.map((participant: Participant) => participant.username).join(', ')} joined the room`
  }

}
