import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiInputNumberModule} from '@taiga-ui/kit';
import {TuiTextfieldControllerModule, TuiButtonModule} from '@taiga-ui/core';

import { NumPassComponent } from './num-pass.component';
import { ReactiveFormsModule } from '@angular/forms';

const TAIGA_MODULES = [
  TuiInputNumberModule,
  TuiTextfieldControllerModule,
  TuiButtonModule
]

@NgModule({
  declarations: [
    NumPassComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...TAIGA_MODULES
  ],
  exports: [
    NumPassComponent
  ]
})
export class NumPassModule { }
