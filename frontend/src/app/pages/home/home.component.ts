import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private authService: AuthService, private twilioService: TwilioService) { }

  ngOnInit(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  async signIn(): Promise<void> {
    if (this.authenticating) return
    this.authenticating = true;
    await this.authService.signIn();
    this.authenticating = false;
  }

  async signOut(): Promise<void> {
    this.isAvatarMenuOpen = false;
    return this.authService.signOut();
  }

  async joinRoom() {
    if (!this.selectedRoom || this.joining) return
    this.joining = true;
    await this.twilioService.joinRoom(this.selectedRoom)
    this.router.navigateByUrl(`/room/${this.selectedRoom}`)
    this.joining = false;
  }

  onRoomValueChange(room: string) {
    this.selectedRoom = room
  }
}
