import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '@twilio/conversations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() messages: Message[] = [];
  @Input() username: string = '';
  @Output() onSend = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    this.onSend.emit(message);
  }

}
