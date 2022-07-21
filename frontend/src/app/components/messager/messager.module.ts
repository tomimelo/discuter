import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {TuiInputModule} from '@taiga-ui/kit';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';

import { MessagerComponent } from './messager.component';
import { TimerPipe } from 'src/app/pipes/timer.pipe';
import { AudioRecorderModule } from 'src/app/lib/audio-recorder/audio-recorder.module';

const TAIGA_MODULES = [
  TuiTextfieldControllerModule,
  TuiInputModule,
  TuiButtonModule,
  TuiSvgModule
]

@NgModule({
  declarations: [
    MessagerComponent,
    TimerPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AudioRecorderModule,
    ...TAIGA_MODULES
  ],
  exports: [
    MessagerComponent
  ]
})
export class MessagerModule { }
