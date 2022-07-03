import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Conversation } from '@twilio/conversations';
import { TwilioService } from 'src/app/services/twilio.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public user: User | null = null;
  public isOwner: boolean = false
  public conversation: Conversation | null = null

  constructor(private twilioService: TwilioService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.twilioService.getConversation().subscribe(conversation => {
      this.conversation = conversation
    })
    this.authService.getUser().subscribe(user => {
      this.user = user
      this.isOwner = this.user?.user_name === this.conversation?.createdBy
    })
  }

  async sendMessage(message: string) {
    return this.twilioService.sendMessage(message)
  }

  async leaveRoom() {
    await this.twilioService.leaveRoom()
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
