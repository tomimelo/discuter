import { Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { Participant } from '@twilio/conversations';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit {

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
              private twilioService: TwilioService) { }

  ngOnInit(): void {
  }

  async inviteParticipant() {
    const identity = this.identityControl.value.trim()
    if (identity === '') this.identityControl.setValue('')
    if (this.inviteForm.invalid) return
    await this.twilioService.inviteParticipant(identity)
    this.inviteForm.reset({ identity: '' })
  }

}
