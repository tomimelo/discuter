import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation, Message, Participant } from '@twilio/conversations';
import { TwilioService } from 'src/app/services/twilio.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user';
import { Subject, takeUntil } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import { ParticipantsListComponent } from 'src/app/components/participants-list/participants-list.component';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  public user: User | null = null;
  public isHost: boolean = false
  public conversation: Conversation | null = null
  public participants: Participant[] = []
  private destroy$ = new Subject<void>()
  private isJoined: boolean = false
  public loading: boolean = true
  public messages: Message[] = []

  constructor(private twilioService: TwilioService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(TuiDialogService)
              private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,) {
  }

  async ngOnInit() {
    this.twilioService.getConversation().pipe(takeUntil(this.destroy$)).subscribe(async conversation => {
      this.conversation = conversation
      if (this.conversation) {
        await this.setupConversation()
      }
      if (this.isJoined || this.conversation?.status === 'joined') {
        this.isJoined = true
        this.loading = false
        return;
      }
      const roomId = this.route.snapshot.paramMap.get('id')
      if (roomId) await this.twilioService.joinRoom(roomId)
      this.loading = false
    })
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user
      this.isHost = this.twilioService.isHost()
    })
    this.twilioService.onMessage.pipe(takeUntil(this.destroy$)).subscribe(message => {
      this.messages.push(message)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.conversation?.removeAllListeners()
  }

  async setupConversation() {
    await Promise.all([
      this.loadMessages(),
      this.setParticipants()
    ])
  }
  
  async loadMessages() {
    if (this.conversation) {
      const messages = await this.conversation.getMessages()
      this.messages.push(...messages.items)
    }
  }

  async setParticipants() {
    this.participants = await this.conversation?.getParticipants() || []
  }

  async sendMessage(message: string) {
    return this.twilioService.sendMessage(message)
  }

  async goBack() {
    await this.twilioService.leaveRoom()
    this.router.navigateByUrl('/home')
  }

  async showParticipants() {
    this.dialogService.open<Participant[]>(
      new PolymorpheusComponent(ParticipantsListComponent, this.injector),
      {
        data: this.participants,
        dismissible: true
      }
    ).subscribe()
  }

  async leaveRoom() {
    await this.twilioService.leaveConversation()
    this.router.navigateByUrl('/home')
  }

  async deleteRoom() {
    await this.twilioService.deleteRoom()
    this.router.navigateByUrl('/home')
  }

  async inviteParticipant(participant: string) {
    await this.twilioService.inviteParticipant(participant)
  }
}
