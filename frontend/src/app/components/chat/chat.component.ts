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
  public isScrollOnBottom: boolean = false
  public unreadMessages: number = 0
  private scrollTimeout: any = 0

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
    this.unreadMessages = 0
  }

  private getMessagesContainer(): void {
    this.messagesContainer = this.document.getElementById('messages')

    this.messagesContainer?.addEventListener('scroll', (event) => {
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        this.checkScroll()
      }, 100)
    })
  }

  private onNewMessage() {
    this.roomService.onChanges.pipe(filter(event => event.type === 'messageAdded'), takeUntil(this.destroy$)).subscribe(() => {
      this.playSound()
      if (this.isScrollOnBottom) {
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

  private async playSound() {
    const audio = new Audio('/assets/sounds/new-message.mp3')
    await audio.play()
  }


}
