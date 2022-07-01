import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-child',
  templateUrl: './room-child.component.html',
  styleUrls: ['./room-child.component.scss']
})
export class RoomChildComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    console.log(message);
  }

}
