import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from './room-list.component';
import { TuiButtonModule, TuiHintModule, TuiLoaderModule, TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';

const TAIGA_MODULES = [
  TuiScrollbarModule,
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiSvgModule
]

@NgModule({
  declarations: [
    RoomListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ...TAIGA_MODULES
  ],
  exports: [
    RoomListComponent
  ]
})
export class RoomListModule { }
