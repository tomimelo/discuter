import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message!: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
