import { Component, Inject } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiNotification } from '@taiga-ui/core';
import { Participant } from '@twilio/conversations';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {

  public inviteForm = new FormGroup({
    identity: new FormControl('', Validators.required)
  })

  get participants() {
    return this.context.data;
  }

  get identityControl(): FormControl {
    return this.inviteForm.get('identity') as FormControl
  }

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<Participant[], Participant[]>,
              private twilioService: TwilioService,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) { }

  async inviteParticipant() {
    const identity = this.identityControl.value.trim()
    if (identity === '') this.identityControl.setValue('')
    if (this.inviteForm.invalid) return
    try {
      await this.twilioService.inviteParticipant(identity)
      this.inviteForm.reset({ identity: '' })
    } catch (error: any) {
      this.handleError(error.message)
    }
  }

  handleError(message: string = 'Something went wrong, please try again.') {
    this.alertService.open(message, {autoClose: true, hasIcon: true, status: TuiNotification.Error}).subscribe()
  }

}