import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation, Message, Participant } from '@twilio/conversations';
import { TwilioService } from 'src/app/services/twilio.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user';
import { Subject, takeUntil } from 'rxjs';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { PolymorpheusComponent, PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
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
  private alreadyJoined: boolean = false
  public loading: boolean = true
  public messages: Message[] = []

  constructor(private twilioService: TwilioService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(TuiDialogService)
              private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) {
  }

  ngOnInit() {
    this.getConversation()
    this.getUser()
    this.listenOnMessage()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.conversation?.removeAllListeners()
  }

  getConversation(): void {
    this.twilioService.getConversation().pipe(takeUntil(this.destroy$)).subscribe(async conversation => {
      await this.setupConversation(conversation)
      if (!this.userIsInConversation()) {
        const roomId = this.getRoomIdFromParams()
        if (roomId) await this.joinRoom(roomId)
      }
      this.alreadyJoined = true
      this.loading = false
    })
  }

  getUser(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user
      this.isHost = this.twilioService.isHost()
    })
  }

  listenOnMessage(): void {
    this.twilioService.onMessage.pipe(takeUntil(this.destroy$)).subscribe(message => {
      this.messages.push(message)
    })
  }

  async setupConversation(conversation: Conversation | null) {
    this.conversation = conversation
    if (this.conversation) {
      await Promise.all([
        this.loadMessages(),
        this.setParticipants()
      ])
    }
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

  getRoomIdFromParams(): string | null {
    return this.route.snapshot.paramMap.get('id')
  }

  userIsInConversation(): boolean {
    return this.alreadyJoined || this.conversation?.status === 'joined'
  }

  async joinRoom(roomId: string) {
    try {
      await this.twilioService.joinRoom(roomId)
    } catch (error) {
      this.handleError('Error joining room, please try again.')
      this.router.navigateByUrl('/home')
    }
  }

  async sendMessage(message: string) {
    await this.twilioService.sendMessage(message)
  }

  async goBack() {
    await this.twilioService.leaveRoom()
    this.router.navigateByUrl('/home')
  }

  showParticipants() {
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

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      data: {
        message: "Are you sure you want to leave this room? You will not be able to join again unless someone invite you.",
        confirm: "Leave"
      }
    }).subscribe();
  }

  handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe({next: (some) => {
      console.log(some);
    }})
  }

  consoleLog(data: any) {
    console.log(data);
  }
}
