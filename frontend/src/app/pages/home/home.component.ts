import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public user: User | null = null;
  private destroy$ = new Subject<void>()
  public authenticating: boolean = false;
  public isAvatarMenuOpen: boolean = false;
  private selectedRoom: string | null = '00000';
  public joining: boolean = false;
  public joinButtonIcon: string = 'tuiIconLockLarge';

  constructor(private router: Router, 
              private authService: AuthService, 
              private twilioService: TwilioService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  ngOnInit(): void {
    this.getUser()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getUser(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe({next: user => {
      if (user) this.authenticating = false;
      this.user = user
    }, error: err => {
      this.user = null
      this.handleError()
    }})
  }

  async signIn(): Promise<void> {
    try {
      if (this.authenticating) return
      this.authenticating = true;
      await this.authService.signIn();
    } catch (error) {
      this.authenticating = false;
      this.handleError()
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      this.handleError()
    } finally {
      this.isAvatarMenuOpen = false;
    }
  }

  async joinRoom() {
    try {
      if (!this.selectedRoom || this.joining) return
      this.joining = true;
      await this.twilioService.joinRoom(this.selectedRoom)
      this.router.navigateByUrl(`/room/${this.selectedRoom}`)
    } catch (error: any) {
      this.handleError(error.message)
    } finally {
      this.joining = false;
    }
  }

  onRoomValueChange(room: string) {
    this.selectedRoom = room
  }

  handleError(message: string = 'Something went wrong, please try again') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }
}
