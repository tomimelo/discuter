import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule, TuiSliderModule} from '@taiga-ui/kit';

import { MessageComponent } from './message.component';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { TuiButtonModule } from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

const TAIGA_MODULES = [
  TuiAvatarModule,
  TuiButtonModule,
  TuiSliderModule
]

@NgModule({
  declarations: [
    MessageComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ...TAIGA_MODULES
  ],
  exports: [
    MessageComponent
  ]
})
export class MessageModule { }
