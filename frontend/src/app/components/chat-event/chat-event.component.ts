import { Component, Input } from '@angular/core';
import { ChatEvent } from 'src/app/types/chat';
import { Participant } from 'src/app/types/participant';

interface SimplifiedEvent {
  type: string;
  data: any;
  label: string | undefined;
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

  private buildSimplifiedEvent(event: ChatEvent): SimplifiedEvent {
    return {
      type: event.type,
      data: event.data,
      label: this.getEventLabel(event)
    }
  }

  private getEventLabel(event: ChatEvent): string | undefined {
    if (event.type === 'message') return undefined
    const eventData = event.data as Participant[]
    if (eventData.length === 1) { 
      return `${eventData[0].username} joined the room`
    } else if (eventData.length >= 4) {
      const firstTwoParticipants = eventData.slice(0, 2)
      return `${firstTwoParticipants.map(p => p.username).join(' and ')} joined the room along with ${eventData.length - 2} others`
    } else {
      return `${eventData.map(participant => participant.username).join(', ').replace(/, ([^,]*)$/, ' and $1')} joined the room`
    }
  }

}
