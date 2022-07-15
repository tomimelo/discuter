import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() messages: Message[] = [];
  @Output() onSend = new EventEmitter<string>();
  private messagesContainer: HTMLElement | null = null;
  private destroy$ = new Subject<void>()

  constructor(private roomService: RoomService,
              @Inject(DOCUMENT) private document: Document) {
  }
  
  public ngOnInit(): void {
    this.getMessagesContainer()
    this.onNewMessage();
  }
  
  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
  public sendMessage(message: string) {
    this.onSend.emit(message);
  }

  private getMessagesContainer(): void {
    this.messagesContainer = this.document.getElementById('messages')
  }

  private onNewMessage() {
    this.roomService.onChanges.pipe(filter(event => event.type === 'messageAdded'), takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
    })
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

}
