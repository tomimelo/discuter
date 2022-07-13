import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() messages: Message[] = [];
  @Output() onSend = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    this.onSend.emit(message);
  }

}
