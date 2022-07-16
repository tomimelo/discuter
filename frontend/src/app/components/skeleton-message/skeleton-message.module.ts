import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonMessageComponent } from './skeleton-message.component';

@NgModule({
  declarations: [
    SkeletonMessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkeletonMessageComponent
  ]
})
export class SkeletonMessageModule { }
