import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from './room-list.component';
import { TuiButtonModule, TuiHintModule, TuiScrollbarModule } from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiScrollbarModule,
  TuiButtonModule,
  TuiHintModule
]

@NgModule({
  declarations: [
    RoomListComponent
  ],
  imports: [
    CommonModule,
    ...TAIGA_MODULES
  ],
  exports: [
    RoomListComponent
  ]
})
export class RoomListModule { }
