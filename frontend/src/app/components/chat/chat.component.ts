import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
  public isScrollOnBottom: boolean = false

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

  public scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    this.isScrollOnBottom = true
  }

  private getMessagesContainer(): void {
    this.messagesContainer = this.document.getElementById('messages')
  }

  private onNewMessage() {
    this.roomService.onChanges.pipe(filter(event => event.type === 'messageAdded'), takeUntil(this.destroy$)).subscribe(() => {
      this.checkScroll()
    })
  }

  private checkScroll() {
    if (this.messagesContainer) {
      console.log({scrollTop: this.messagesContainer.scrollTop, scrollHeight: this.messagesContainer.scrollHeight, clientHeight: this.messagesContainer.clientHeight});
      this.isScrollOnBottom = this.messagesContainer.scrollTop + this.messagesContainer.clientHeight >= this.messagesContainer.scrollHeight
      console.log({scrollTop: this.messagesContainer.scrollTop, scrollHeight: this.messagesContainer.scrollHeight, clientHeight: this.messagesContainer.clientHeight});
    }
  }


}
