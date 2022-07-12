import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsListComponent } from './participants-list.component';
import { TuiAvatarModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiTextfieldControllerModule, TuiScrollbarModule } from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';

const TAIGA_MODULES = [
  TuiTextfieldControllerModule,
  TuiInputModule,
  TuiButtonModule,
  TuiHintModule,
  TuiAvatarModule,
  TuiScrollbarModule
]

@NgModule({
  declarations: [
    ParticipantsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ParticipantsListComponent
  ]
})
export class ParticipantsListModule { }
