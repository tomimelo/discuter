import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import { ParticipantsListComponent } from 'src/app/components/participants-list/participants-list.component';
import { ConfirmDialogComponent, ConfirmDialogContext } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Room, RoomEventType, RoomSettings } from 'src/app/types/room';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/types/message';
import { RoomSettingsComponent } from 'src/app/components/room-settings/room-settings.component';
import { Participant } from 'src/app/types/participant';
import { ChatEvent } from 'src/app/types/chat';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  public user: User | null = null
  public room: Room | null = null
  public events: ChatEvent[] = []
  public loading: boolean = true
  public isOptionsMenuOpen: boolean = false
  private soundsSettings: RoomSettings['sounds'] = {
    newMessage: true,
    userJoin: true
  }
  private destroy$ = new Subject<void>()

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
    this.listenSettings()
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.roomService.leaveRoom()
  }

  public async sendMessage(message: string) {
    await this.roomService.sendMessage(message)
  }

  public goBack() {
    this.router.navigateByUrl('/home')
  }

  public showParticipants() {
    this.dialogService.open<void>(
      new PolymorpheusComponent(ParticipantsListComponent, this.injector),
      {
        data: {room: this.room, user: this.user},
        dismissible: true
      }
    ).pipe(takeUntil(this.destroy$)).subscribe()
  }

  public showSettings() {
    this.dialogService.open<void>(
      new PolymorpheusComponent(RoomSettingsComponent, this.injector),
      {
        dismissible: true
      }
    ).pipe(takeUntil(this.destroy$)).subscribe()
  }

  public async abandonRoom() {
    this.showConfirmDialog({
      message: 'Are you sure you want to leave this room?',
      confirmText: 'Leave'
    }).pipe(takeUntil(this.destroy$)).subscribe(async confirmation => {
      if (confirmation) {
        await this.roomService.abandonRoom()
        this.router.navigateByUrl('/home')
      }
    })
  }

  public async deleteRoom() {
    if (!this.room || !this.room.isOwn) return
    this.showConfirmDialog({
      message: 'Are you sure you want to delete this room?',
      confirmText: 'Delete'
    }).pipe(takeUntil(this.destroy$)).subscribe(async confirmation => {
      if (confirmation) {
        await this.roomService.deleteRoom(this.room!.uniqueName)
        this.router.navigateByUrl('/home')
      }
    })
  }

  private getRoom(): void {
    this.roomService.getRoom().pipe(takeUntil(this.destroy$)).subscribe(async room => {
      this.room = room
      if (this.doesUserNeedToJoin()) {
        const roomId = this.getRoomNameFromParams()
        if (roomId) {
          if (!this.roomService.isRoomCodeValid(roomId)) {
            this.alertService.open('Invalid room code', {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
            this.goBack()
          }
          await this.joinRoom(roomId)
        }
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
        case 'roomRemoved':
          this.onRoomRemoved()
          break
      }
    })
  }

  private onMessageAdded(message: Message) {
    this.room?.messages.push(message)
    this.addEvent('messageAdded', message)
    if (!message.isOwn) this.playNewMessageSound()
  }

  private onParticipantJoined(participant: Participant) {
    this.room?.participants.push(participant)
    this.addEvent('participantJoined', participant)
    this.playUserJoinSound()
  }

  private onParticipantLeft(participant: Participant) {
    if (participant.username === this.user?.user_name) {
      this.goBack()
      this.alertService.open('You were kicked from the room', {autoClose: true, hasIcon: true, status: TuiNotification.Warning}).subscribe()
    }
    if (this.room) {
      this.room.participants = this.room?.participants.filter(p => p.username !== participant.username)
    }
  }

  private onRoomRemoved() {
    if (this.room && !this.room.isOwn) {
      this.goBack()
      this.alertService.open('The room was removed by the host', {autoClose: true, hasIcon: true, status: TuiNotification.Warning}).subscribe()
    }
  }

  private addEvent(type: RoomEventType, data: Message | Participant) {
  }

  private listenSettings(): void {
    this.roomService.onSettingsChanges().pipe(takeUntil(this.destroy$)).subscribe(settings => {
      if (settings.sounds) {
        this.soundsSettings = settings.sounds
      }
    })
  }

  private getRoomNameFromParams(): string | null {
    return this.route.snapshot.paramMap.get('name')
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

  private async playSound(src: string) {
    const audio = new Audio(src)
    await audio.play()
  }

  private async playNewMessageSound() {
    const src = '/assets/sounds/new-message.mp3'
    if (this.soundsSettings?.newMessage) {
      await this.playSound(src)
    }
  }

  private async playUserJoinSound() {
    const src = '/assets/sounds/user-join.mp3'
    if (this.soundsSettings?.userJoin) {
      await this.playSound(src)
    }
  }

  // private buildEvents(participants: Participant[], messages: Message[]): RoomEvent<'messageAdded' | 'participantJoined'>[] {
  //   const messageEvents = messages.map(message => {
  //     return {
  //       type: 'messageAdded',
  //       data: message
  //     }
  //   })
  //   const participantEvents = participants.filter(participant => participant.username !== this.twilioService.getUserIdentity()).map(participant => {
  //     return {
  //       type: 'participantJoined',
  //       data: participant
  //     }
  //   })
  //   const mergedEvents = [...messageEvents, ...participantEvents]
  //   return mergedEvents.sort((a, b) => a.data.dateCreated > b.data.dateCreated ? 1 : -1) as RoomEvent<'messageAdded' | 'participantJoined'>[]
  // }

  private handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }
}
