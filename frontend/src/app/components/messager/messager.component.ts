import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-messager',
  templateUrl: './messager.component.html',
  styleUrls: ['./messager.component.scss']
})
export class MessagerComponent implements OnInit {

  @Output() onSend = new EventEmitter<string>();

  public messageForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  get textControl(): FormControl {
    return this.messageForm.get('text') as FormControl
  }

  constructor() {}
  
  ngOnInit(): void {
  }
  
  sendMessage() {
    if (this.textControl.value.trim() === '') {
      this.textControl.setValue('')
    }
    if (this.messageForm.invalid) return
    this.onSend.emit(this.messageForm.value.text)
    this.messageForm.reset({ text: '' })
  }

}
