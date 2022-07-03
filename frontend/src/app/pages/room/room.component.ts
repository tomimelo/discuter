import { Component, OnInit } from '@angular/core';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private twilioService: TwilioService) { }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    this.twilioService.sendMessage(message)
  }

}
