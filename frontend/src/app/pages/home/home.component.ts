import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user: User | null = null;

  constructor(private router: Router, private authService: AuthService, private twilioService: TwilioService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.user = user
    })
  }

  async signIn(): Promise<void> {
    return this.authService.signIn();
  }

  async signOut(): Promise<void> {
    return this.authService.signOut();
  }

  async joinRoom(room: string) {
    await this.twilioService.joinRoom(room)
    this.router.navigateByUrl(`/room/${room}`)
  }
}
