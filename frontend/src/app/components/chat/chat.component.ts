import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { ChatEvent } from 'src/app/types/chat';
import { Participant } from 'src/app/types/participant';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() set events(value: ChatEvent[]) {
    this._events = value
    setTimeout(() => {
      this.getMessagesContainer()
      this.checkScroll()
    }, 1000)
  }
  @Input() skeleton: boolean = false
  @Input() set participantsTyping(participants: Participant[]) {
    this.setTypingMessage(participants)
  }
  @Output() onSend = new EventEmitter<string>();
  public isScrollOnBottom: boolean = true
  public unreadMessages: number = 0
  public typingMessage: string | null = null
  private messagesContainer: HTMLElement | null = null;
  private scrollTimeout: any = 0
  private destroy$ = new Subject<void>()
  private _events: ChatEvent[] = []

  get events(): ChatEvent[] {
    return this._events
  }

  public skeletonMessages = [
    {reversed: false},
    {reversed: false},
    {reversed: false},
    {reversed: true},
    {reversed: true},
    {reversed: false},
  ]

  constructor(private roomService: RoomService,
              @Inject(DOCUMENT) private document: Document) {}
  
  public ngOnInit(): void {
    this.onNewMessage()
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
    this.unreadMessages = 0
  }

  public onTyping() {
    this.roomService.typing()
  }

  private setTypingMessage(participants: Participant[]) {
    this.typingMessage = ''
  }

  private getMessagesContainer(): void {
    this.messagesContainer = this.document.getElementById('messages')
    if (this.messagesContainer) {
      this.messagesContainer?.addEventListener('scroll', (event) => {
        clearTimeout(this.scrollTimeout)
        this.scrollTimeout = setTimeout(() => {
          this.checkScroll()
        }, 100)
      })
    }
  }

  private onNewMessage() {
    this.roomService.onChanges.pipe(filter(event => event.type === 'messageAdded'), takeUntil(this.destroy$)).subscribe(({data: message}: any) => {
      if (this.isScrollOnBottom || message.isOwn) {
        setTimeout(() => {
          this.scrollToBottom()
        }, 50)
      } else {
        this.unreadMessages++
        this.checkScroll()
      }
    })
  }

  private checkScroll() {
    if (this.messagesContainer) {
      this.isScrollOnBottom = this.messagesContainer.scrollTop + this.messagesContainer.clientHeight >= this.messagesContainer.scrollHeight
    }
    if (this.isScrollOnBottom) {
      this.unreadMessages = 0
    }
  }
}
