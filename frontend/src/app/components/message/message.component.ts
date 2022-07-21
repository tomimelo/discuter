import { Component, Input } from '@angular/core';
import { Message, MessageMedia } from 'src/app/types/message';
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
  public image: any | null = null

  constructor() { }

  private async processMessage(message: Message) {
    this.processedMessage = message
    if (message.type === 'media') {
      const media = message.media
      if (this.isAudio(media)) {
        this.createAudio(message)
      }
      if (this.isImage(media)) {
        this.createImage(message)
      }
    }
  }

  private isAudio(media: MessageMedia | null): boolean {
    return !!media && media.contentType.startsWith('audio/')
  }

  private isImage(media: MessageMedia | null): boolean {
    return !!media && media.contentType.startsWith('image/')
  }

  private createAudio(message: Message) {
    this.audio = {
      id: message.id,
      url: message.media!.url
    }
  }

  private createImage(message: Message) {
    this.image = {
      id: message.id,
      url: message.media!.url
    }
  }

}
