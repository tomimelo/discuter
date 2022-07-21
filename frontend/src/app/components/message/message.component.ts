import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'src/app/types/message';
import { Audio } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  @Input() set message(message: Message) {
    this.processMessage(message)
  }

  public processedMessage!: Message
  public audio: Audio | null = null

  constructor() { }

  private async processMessage(message: Message) {
    this.processedMessage = message
    if (message.type === 'media') {
     this.createAudio(message)
    }
  }

  private createAudio(message: Message) {
    if (message.media) {
      this.audio = {
        id: message.id,
        url: message.media
      }
    }
  }

}
