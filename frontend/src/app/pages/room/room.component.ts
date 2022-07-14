import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant } from '@twilio/conversations';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import { ParticipantsListComponent } from 'src/app/components/participants-list/participants-list.component';
import { ConfirmDialogComponent, ConfirmDialogContext } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Room } from 'src/app/types/room';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/types/message';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  public user: User | null = null
  public room: Room | null = null
  private destroy$ = new Subject<void>()
  public loading: boolean = true
  public isOptionsMenuOpen: boolean = false

  constructor(private roomService: RoomService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(TuiDialogService)
              private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) {
  }

  public ngOnInit() {
    this.getRoom()
    this.getUser()
    this.listenOnChanges()
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.roomService.leaveRoom()
  }

  public async sendMessage(message: string) {
    await this.roomService.sendMessage(message)
  }

  public async goBack() {
    this.router.navigateByUrl('/home')
  }

  public showParticipants() {
    this.dialogService.open<Participant[]>(
      new PolymorpheusComponent(ParticipantsListComponent, this.injector),
      {
        data: this.room,
        dismissible: true
      }
    ).subscribe()
  }

  public async abandonRoom() {
    this.showConfirmDialog({
      message: 'Are you sure you want to leave this room?',
      confirmText: 'Leave'
    }).subscribe(async confirmation => {
      if (confirmation) {
        await this.roomService.abandonRoom()
        this.router.navigateByUrl('/home')
      }
    })
  }

  public async deleteRoom() {
    await this.roomService.deleteRoom()
    this.router.navigateByUrl('/home')
  }

  private getRoom(): void {
    this.roomService.getRoom().pipe(takeUntil(this.destroy$)).subscribe(async room => {
      this.room = room
      if (this.doesUserNeedToJoin()) {
        const roomId = this.getRoomIdFromParams()
        if (roomId) await this.joinRoom(roomId)
      }
      this.loading = false
    })
  }

  private getUser(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user
    })
  }

  private listenOnChanges(): void {
    this.roomService.onChanges.pipe(takeUntil(this.destroy$)).subscribe(event => {
      switch (event.type) {
        case 'messageAdded':
          this.onMessageAdded(event.data as Message)
          break
        case 'participantJoined':
          this.onParticipantJoined(event.data as Participant)
          break
        case 'participantLeft':
          this.onParticipantLeft(event.data as Participant)
          break
      }
    })
  }

  private onMessageAdded(message: Message) {
    this.room?.messages.push(message)
  }

  private onParticipantJoined(participant: Participant) {
    this.room?.participants.push(participant)
  }

  private onParticipantLeft(participant: Participant) {
    if (this.room) {
      this.room.participants = this.room?.participants.filter(p => p.username !== participant.identity)
    }
  }

  private getRoomIdFromParams(): string | null {
    return this.route.snapshot.paramMap.get('id')
  }

  private doesUserNeedToJoin(): boolean {
    return !this.roomService.isUserInRoom()
  }

  private async joinRoom(roomId: string) {
    try {
      await this.roomService.joinRoom(roomId)
    } catch (error: any) {
      this.handleError(error.message)
      this.router.navigateByUrl('/home')
    }
  }

  private showConfirmDialog(data: ConfirmDialogContext): Observable<boolean> {
    return this.dialogService.open<boolean>(
      new PolymorpheusComponent(ConfirmDialogComponent, this.injector),
      {
        data,
        dismissible: true
      }
    )
  }

  private handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe({next: (some) => {
      console.log(some);
    }})
  }
}
