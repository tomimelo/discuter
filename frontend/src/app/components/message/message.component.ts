import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  public audioControl = new FormControl(0)
  public audioState: 'playing' | 'paused' = 'paused'
  public audioIcon: string = 'tuiIconPlayLarge'
  private audioElement: HTMLAudioElement | null = null
  public audioDuration: number = 0

  @Input() set message(message: Message) {
    this.setMessage(message)
  }
  public processedMessage!: Message;

  constructor(private ref: ChangeDetectorRef) { }

  public ngOnInit(): void {
  }

  public toggleAudioState() {
    this.audioState = this.audioState === 'playing' ? 'paused' : 'playing'
    this.audioIcon = this.audioState === 'playing' ? 'tuiIconPauseLarge' : 'tuiIconPlayLarge'
  }

  private async setMessage(message: Message) {
    this.processedMessage = message
    this.ref.detectChanges()
    this.setAudioElement()
    if (message && this.audioElement) {
      await this.loadAudioMetadata()
      console.log(this.audioElement);
    }
  }

  private setAudioElement() {
    if (!this.audioElement) {
      this.audioElement = document.getElementById(`audio-${this.processedMessage.id}`) as HTMLAudioElement
    }
  }

  private async loadAudioMetadata() {
    if (!this.audioElement) {
      console.log("NO AUDIO ELEMENT");
      return
    }
    if (this.audioElement.readyState > 0) {
      await this.setAudioDuration()
      // setSliderMax();
    } else {
      this.audioElement.addEventListener('loadedmetadata', async () => {
        await this.setAudioDuration()
        // setSliderMax();
      });
    }
  }

  private async getAudioDuration(): Promise<number> {
    if (this.audioElement!.duration === Infinity) {
      this.audioElement!.currentTime = 1e101
      return new Promise<number>(resolve => {
        this.audioElement!.addEventListener('timeupdate', () => {
          this.audioElement!.currentTime = 0
          resolve(this.audioElement!.duration)
        }, {once: true})
      })
    } else {
      return this.audioElement!.duration
    }
  }

  private async setAudioDuration() {
    this.audioDuration = await this.getAudioDuration()
  }

}
