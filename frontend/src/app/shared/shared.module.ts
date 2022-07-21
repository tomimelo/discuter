import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerPipe } from '../pipes/timer.pipe';

const SHARED_PIPES = [
  TimerPipe
]

@NgModule({
  declarations: [...SHARED_PIPES],
  imports: [
    CommonModule
  ],
  exports: [
    ...SHARED_PIPES
  ]
})
export class SharedModule { }
