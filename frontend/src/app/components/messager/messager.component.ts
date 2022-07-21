import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, interval, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-messager',
  templateUrl: './messager.component.html',
  styleUrls: ['./messager.component.scss']
})
export class MessagerComponent implements OnInit {

  @Output() onSend = new EventEmitter<string>()
  @Output() typing = new EventEmitter<void>()
  @Input() maxLength: number = 1500

  public currentTime$ = new BehaviorSubject<number>(0)
  private stopTimer$ = new Subject<void>()

  public recording: boolean = false

  public messageForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  get textControl(): FormControl {
    return this.messageForm.get('text') as FormControl
  }

  constructor() {}
  
  public ngOnInit(): void {
  }
  
  public sendMessage() {
    if (this.textControl.value.trim() === '') {
      this.textControl.setValue('')
    }
    if (this.messageForm.invalid || this.textControl.value.length > this.maxLength) return
    this.onSend.emit(this.messageForm.value.text)
    this.messageForm.reset({ text: '' })
  }

  public onKeyDown(event: KeyboardEvent) {
    if (!this.isEnterKey(event)) {
      this.typing.emit()
    }
  }

  private isEnterKey(event: KeyboardEvent) {
    return event.key === 'Enter' || event.keyCode === 13
  }

  public startRecording() {
    this.recording = true
    this.startTimer()
  }

  public pauseRecording() {
    //Add pause button and resume
    this.pauseTimer()
  }

  public cancelRecording() {
    this.recording = false
    this.stopTimer()
  }

  public sendRecording() {
    this.recording = false
    this.stopTimer()
  }

  private startTimer() {
    interval(1000).pipe(
      takeUntil(this.stopTimer$),
      tap(v => {
        this.currentTime$.next(v + 1)
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
