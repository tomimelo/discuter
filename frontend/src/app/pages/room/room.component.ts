import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  joinRoom(room: string) {
    console.log(room);
    this.router.navigate(['/room', room]);
  }

}
