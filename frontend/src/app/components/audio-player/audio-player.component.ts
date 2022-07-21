import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface Audio {
  id: string,
  url: string
}

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  @Input() set audio(audio: Audio | null) {
    this.setupAudio(audio)
  }
  @Input() step: number = 0.1
  @Input() sliderMax: number = 0
  @Input() sliderMin: number = 0

  public processedAudio: Audio | null = null
  public audioControl = new FormControl(0)
  public state: 'playing' | 'paused' = 'paused'
  public icon: string = 'tuiIconPlayLarge'
  public duration: number = 0
  private audioElement: HTMLAudioElement | null = null
  public loading: boolean = false

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public toggleState() {
    if (this.state === 'paused') {
      this.play()
    } else {
      this.pause()
    }
  }

  public onInput() {
    this.duration = this.audioControl.value
  }

  public onChange() {
    this.audioElement!.currentTime = this.audioControl.value
  }

  private play() {
    this.state = 'playing'
    this.icon = 'tuiIconPauseLarge'
    this.audioElement!.play()
  }

  private pause() {
    this.state = 'paused'
    this.icon = 'tuiIconPlayLarge'
    this.audioElement!.pause()
  }

  private async setupAudio(audio: Audio | null) {
    this.audioControl.disable()
    this.loading = true
    this.processedAudio = audio
    this.ref.detectChanges()
    this.setAudioElement()
    if (audio && this.audioElement) {
      await this.loadAudioMetadata()
      this.listenOnAudioTimeUpdate()
      this.listenOnAudioEnded()
    }
    this.loading = false
    this.audioControl.enable()
  }

  private setAudioElement() {
    if (!this.processedAudio) {
      this.audioElement = null
      return
    }
    if (!this.audioElement) {
      this.audioElement = document.getElementById(`audio-${this.processedAudio.id}`) as HTMLAudioElement
    }
  }

  private async loadAudioMetadata() {
    if (!this.audioElement) {
      throw new Error('Audio element is not set')
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
    this.duration =  await this.getAudioDuration()
    this.sliderMax = Math.floor(this.duration)
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
      this.duration = this.audioElement!.currentTime
    })
  }

  private listenOnAudioEnded() {
    this.audioElement!.removeAllListeners?.('ended')
    this.audioElement!.addEventListener('ended', async () => {
      await this.restartAudioPlayer()
    })
  }

  private async restartAudioPlayer() {
    this.state = 'paused'
    this.icon = 'tuiIconPlayLarge'
    this.duration = await this.getAudioDuration()
    this.audioControl.setValue(0)
  }

}
