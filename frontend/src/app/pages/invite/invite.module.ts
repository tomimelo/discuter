import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite.component';


@NgModule({
  declarations: [
    InviteComponent
  ],
  imports: [
    CommonModule,
    InviteRoutingModule
  ]
})
export class InviteModule { }
