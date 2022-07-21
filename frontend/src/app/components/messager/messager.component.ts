import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, interval, Subject, takeUntil, tap } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';
import { AudioRecorderService, ErrorCase, OutputFormat, RecorderState } from 'src/app/lib/audio-recorder/audio-recorder.service';
import { Media, MessageType } from '@twilio/conversations';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

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

  constructor(private audioRecorder: AudioRecorderService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) {}
  
  public ngOnInit(): void {
    this.getRecorderState()
    this.listenRecorderErrors()
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
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        return
      }
      this.handleError()
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

  private listenRecorderErrors() {
    this.audioRecorder.recorderError.subscribe(error => {
      switch (error) {
        case ErrorCase.ALREADY_RECORDING:
          this.handleError('You are already recording.')
          break;
        case ErrorCase.INVALID_OUTPUT_FORMAT:
          this.handleError('You need to provide a valid output format.')
          break;
        case ErrorCase.RECORDER_TIMEOUT:
          this.handleError()
          break;
        case ErrorCase.USER_CONSENT_FAILED:
          this.handleError('You need to allow access to your microphone.')
          break;
        default:
          this.handleError()
          break;
      }
    })
  }
  
  private getRecorderState(): void {
    let timeout: NodeJS.Timeout
    this.audioRecorder.getRecorderState().subscribe(state => {
      if (state === RecorderState.WAITING_FOR_USER_CONSENT) {
        //Prevent message flashing when waiting for user consent
        timeout = setTimeout(() => {
          this.recorderState = state
        }, 300)
      } else {
        this.recorderState = state
        clearTimeout(timeout)
      }
    })
  }

  private handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }

}
