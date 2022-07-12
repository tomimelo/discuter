import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { TuiButtonModule } from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiButtonModule
]

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
