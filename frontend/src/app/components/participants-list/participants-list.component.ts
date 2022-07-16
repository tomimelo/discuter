import { Component, Inject } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiNotification } from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TwilioService } from 'src/app/services/twilio.service';
import { Room } from 'src/app/types/room';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {

  public inviteForm: FormGroup = new FormGroup({
    identity: new FormControl('', Validators.required)
  })

  get room(): Room {
    return this.context.data.room
  }

  get user(): User {
    return this.context.data.user
  }

  get identityControl(): FormControl {
    return this.inviteForm.get('identity') as FormControl
  }

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<void, {room: Room, user: User}>,
              private twilioService: TwilioService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  public async inviteParticipant(): Promise<void> {
    const identity = this.identityControl.value.trim()
    if (identity === '') this.identityControl.setValue('')
    if (this.inviteForm.invalid) return
    try {
      await this.twilioService.inviteParticipant(identity)
      this.alertService.open(`User ${identity} invited successfully`, {autoClose: true, hasIcon: true, status: TuiNotification.Success}).subscribe()
      this.inviteForm.reset({ identity: '' })
    } catch (error: any) {
      this.handleError(error.message)
    }
  }

  public async kickParticipant(username: string): Promise<void> {
    try {
      await this.twilioService.removeParticipant(username)
      this.alertService.open(`User ${username} kicked successfully`, {autoClose: true, hasIcon: true, status: TuiNotification.Info}).subscribe()
    } catch (error: any) {
      this.handleError(error.message)
    }
  }

  public copyLink(): void {
    if (!this.room.link) {
      this.handleError('Room link is not available.')
      return
    }
    navigator.clipboard.writeText(this.room.link)
    this.alertService.open('Link copied to clipboard', {autoClose: true, hasIcon: true, status: TuiNotification.Success}).subscribe()
  }

  private handleError(message: string = 'Something went wrong, please try again.'): void {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }

}
