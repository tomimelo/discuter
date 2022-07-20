import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { UserRoom } from 'src/app/types/room';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public user: User | null = null;
  public userRooms: UserRoom[] = [];
  public loadingRooms: boolean = true;
  private destroy$ = new Subject<void>()
  public authenticating: boolean = false;
  public isAvatarMenuOpen: boolean = false;
  private selectedRoom: string | null = '00000';
  public joining: boolean = false;
  public lockUnlocked: boolean = false;
  public isRoomCodeValid: boolean = true;

  constructor(private router: Router, 
              private authService: AuthService, 
              private roomService: RoomService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  public ngOnInit(): void {
    this.getUser()
    this.getUserRooms()
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public async signIn(): Promise<void> {
    try {
      if (this.authenticating) return
      this.authenticating = true;
      await this.authService.signIn();
    } catch (error) {
      this.authenticating = false;
      this.handleError()
    }
  }

  public async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      this.handleError()
    } finally {
      this.isAvatarMenuOpen = false;
    }
  }

  public async joinRoom() {
    try {
      if (!this.selectedRoom || this.joining || !this.isRoomCodeValid) return
      this.joining = true;
      await this.roomService.joinRoom(this.selectedRoom)
      this.lockUnlocked = true
      setTimeout(() => {
        this.router.navigateByUrl(`/room/${this.selectedRoom}`)
      }, 1000)
    } catch (error: any) {
      this.handleError(error.message)
    } finally {
      this.joining = false;
    }
  }

  public onRoomValueChange(room: string) {
    this.selectedRoom = room
    this.isRoomCodeValid = this.roomService.isRoomCodeValid(room)
  }

  public async onRoomValueComplete(room: string) {
    if (!this.roomService.isRoomCodeValid(room)) {
      this.handleError('Room code is invalid')
      return;
    }
    this.selectedRoom = room
    await this.joinRoom()
  }

  public getUserRooms(): void {
    this.loadingRooms = true
    this.roomService.getUserRooms().pipe(takeUntil(this.destroy$)).subscribe({next: rooms => {
      this.userRooms = rooms
    }, complete: () => {
      this.loadingRooms = false
    }})
  }

  private getUser(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe({next: user => {
      if (user) this.authenticating = false;
      this.user = user
    }, error: err => {
      this.user = null
      this.handleError()
    }})
  }

  private handleError(message: string = 'Something went wrong, please try again') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }
}
