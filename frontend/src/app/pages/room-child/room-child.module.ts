import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomChildRoutingModule } from './room-child-routing.module';
import { RoomChildComponent } from './room-child.component';


@NgModule({
  declarations: [
    RoomChildComponent
  ],
  imports: [
    CommonModule,
    RoomChildRoutingModule
  ]
})
export class RoomChildModule { }
