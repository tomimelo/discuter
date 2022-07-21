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
  public audioSliderMax: number = 0
  public audioSliderMin: number = 0

  @Input() set message(message: Message) {
    this.setMessage(message)
  }
  public processedMessage!: Message;

  constructor(private ref: ChangeDetectorRef) { }

  public ngOnInit(): void {
  }

  public toggleAudioState() {
    if (this.audioState === 'paused') {
      this.playAudio()
    } else {
      this.pauseAudio()
    }
  }

  public onInput() {
    this.audioDuration = this.audioControl.value
  }

  public onChange() {
    this.audioElement!.currentTime = this.audioControl.value
  }

  private playAudio() {
    this.audioState = 'playing'
    this.audioIcon = 'tuiIconPauseLarge'
    this.audioElement!.play()
  }

  private pauseAudio() {
    this.audioState = 'paused'
    this.audioIcon = 'tuiIconPlayLarge'
    this.audioElement!.pause()
  }

  private async setMessage(message: Message) {
    this.processedMessage = message
    this.ref.detectChanges()
    this.setAudioElement()
    if (message && this.audioElement) {
      await this.loadAudioMetadata()
      this.listenOnAudioTimeUpdate()
      this.listenOnAudioEnded()
    }
  }

  private setAudioElement() {
    if (!this.audioElement) {
      this.audioElement = document.getElementById(`audio-${this.processedMessage.id}`) as HTMLAudioElement
    }
  }

  private async loadAudioMetadata() {
    if (!this.audioElement) {
      throw new Error('Audio element is not set')
      return
    }
    if (this.audioElement.readyState > 0) {
      await this.setupAudioComponent()
    } else {
      this.audioElement.addEventListener('loadedmetadata', async () => {
        await this.setupAudioComponent()
      });
    }
  }

  private async setupAudioComponent() {
    this.audioDuration =  await this.getAudioDuration()
    this.audioSliderMax = Math.floor(this.audioDuration)
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

  private listenOnAudioTimeUpdate() {
    this.audioElement!.removeAllListeners?.('timeupdate')
    this.audioElement!.addEventListener('timeupdate', () => {
      this.audioControl.setValue(this.audioElement!.currentTime)
      this.audioDuration = this.audioElement!.currentTime
    })
  }

  private listenOnAudioEnded() {
    this.audioElement!.removeAllListeners?.('ended')
    this.audioElement!.addEventListener('ended', async () => {
      await this.restartAudioPlayer()
    })
  }

  private async restartAudioPlayer() {
    this.audioState = 'paused'
    this.audioIcon = 'tuiIconPlayLarge'
    this.audioDuration = await this.getAudioDuration()
    this.audioControl.setValue(0)
  }

}
