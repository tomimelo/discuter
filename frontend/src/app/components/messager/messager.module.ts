import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {TuiInputModule} from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';

import { MessagerComponent } from './messager.component';

const TAIGA_MODULES = [
  TuiTextfieldControllerModule,
  TuiInputModule,
  TuiButtonModule
]

@NgModule({
  declarations: [
    MessagerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...TAIGA_MODULES
  ],
  exports: [
    MessagerComponent
  ]
})
export class MessagerModule { }
