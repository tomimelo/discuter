import { Component, Input, OnInit } from '@angular/core';
import { UserRoom } from 'src/app/types/room';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  @Input() rooms: UserRoom[] = []
  @Input() loading: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
