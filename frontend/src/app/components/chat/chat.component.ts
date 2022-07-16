import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() messages: Message[] = [];
  @Output() onSend = new EventEmitter<string>();
  public isScrollOnBottom: boolean = true
  public unreadMessages: number = 0
  private messagesContainer: HTMLElement | null = null;
  private scrollTimeout: any = 0
  private soundsEnabled: boolean = true
  private destroy$ = new Subject<void>()

  constructor(private roomService: RoomService,
              @Inject(DOCUMENT) private document: Document) {}
  
  public ngOnInit(): void {
    this.getMessagesContainer()
    this.onNewMessage()
    this.listenSettings()
  }
  
  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkScroll()
    }, 1000)
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
    this.roomService.onChanges.pipe(filter(event => event.type === 'messageAdded'), takeUntil(this.destroy$)).subscribe(({data: message}) => {
      if (!message.isOwn) this.playSound()
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

  private listenSettings(): void {
    this.roomService.onSettingsChanges().pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.soundsEnabled = settings.sounds ? settings.sounds.newMessage : true
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
    if (this.soundsEnabled) {
      const audio = new Audio('/assets/sounds/new-message.mp3')
      await audio.play()
    }
  }


}
