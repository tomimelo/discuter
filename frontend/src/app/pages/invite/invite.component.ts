import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private apiService: ApiService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  ngOnInit(): void {
    this.joinRoom()
  }

  private getRoomIdFromParams(): string | null {
    return this.route.snapshot.paramMap.get('id')
  }

  private joinRoom() {
    const roomId = this.getRoomIdFromParams()
    if (!roomId) {
      this.handleError()
      return
    }
    this.apiService.joinRoomById(roomId).subscribe({next: async roomLink => {
      this.router.navigateByUrl(`/room/${roomLink.room_name}`)
    }, error: error => {
      if (error.status === 404) {
        this.handleError('Room not found')
        return
      }
      this.handleError()
    }})
  }

  private handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
    this.router.navigateByUrl('/home')
  }

}
