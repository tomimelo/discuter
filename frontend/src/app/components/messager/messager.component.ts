import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, interval, Subject, takeUntil, tap } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';
import { AudioRecorderService, OutputFormat, RecorderState } from 'src/app/lib/audio-recorder/audio-recorder.service';
import { Media, MessageType } from '@twilio/conversations';

export interface MessagerMessage {
  type: MessageType,
  body: string | null,
  media: Blob | null,
}

@Component({
  selector: 'app-messager',
  templateUrl: './messager.component.html',
  styleUrls: ['./messager.component.scss']
})
export class MessagerComponent implements OnInit {

  @Output() onSend = new EventEmitter<MessagerMessage>()
  @Output() typing = new EventEmitter<void>()
  @Input() maxLength: number = 1500

  public currentTime$ = new BehaviorSubject<number>(0)
  private stopTimer$ = new Subject<void>()

  public recorderState: RecorderState = RecorderState.STOPPED

  public messageForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  get textControl(): FormControl {
    return this.messageForm.get('text') as FormControl
  }

  constructor(private audioRecorder: AudioRecorderService) {}
  
  public ngOnInit(): void {
    this.audioRecorder.getRecorderState().subscribe(state => {
      this.recorderState = state
    })
  }
  
  public sendMessage() {
    if (this.textControl.value.trim() === '') {
      this.textControl.setValue('')
    }
    if (this.messageForm.invalid || this.textControl.value.length > this.maxLength) return
    const message = this.createTextMessage(this.messageForm.value.text)
    this.onSend.emit(message)
    this.messageForm.reset({ text: '' })
  }

  public onKeyDown(event: KeyboardEvent) {
    if (!this.isEnterKey(event)) {
      this.typing.emit()
    } else {
      this.sendMessage()
    }
  }

  public async startRecording() {
    try {
      await this.audioRecorder.start()
      this.startTimer()
    } catch (error) {
      //Check if user has denied permission or dismissed the prompt
    }
  }

  public resumeRecording() {
    this.audioRecorder.resume()
    this.startTimer()
  }

  public pauseRecording() {
    this.audioRecorder.pause()
    this.pauseTimer()
  }

  public async stopRecording() {
    const blob = await this.audioRecorder.stop(OutputFormat.WEBM_BLOB) as Blob
    this.stopTimer()
    const message = this.createMediaMessage(blob)
    this.onSend.emit(message)
  }

  public async cancelRecording() {
    await this.audioRecorder.cancel()
    this.stopTimer()
  }

  private createTextMessage(body: string): MessagerMessage {
    return {
      type: 'text',
      body,
      media: null
    }
  }

  private createMediaMessage(data: Blob): MessagerMessage {
    return {
      type: 'media',
      body: null,
      media: data
    }
  }

  private isEnterKey(event: KeyboardEvent) {
    return event.key === 'Enter' || event.code === 'Enter' || event.keyCode === ENTER
  }

  private startTimer() {
    const currentTime = this.currentTime$.value
    interval(1000).pipe(
      takeUntil(this.stopTimer$),
      tap(v => {
        this.currentTime$.next(v + currentTime + 1)
      }),
    )
    .subscribe();
  }

  private pauseTimer() {
    this.stopTimer$.next()
  }

  private stopTimer() {
    this.stopTimer$.next()
    this.currentTime$.next(0)
  }

}
