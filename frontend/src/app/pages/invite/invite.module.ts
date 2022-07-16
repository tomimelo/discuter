import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite.component';
import { TuiLoaderModule } from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiLoaderModule
]
@NgModule({
  declarations: [
    InviteComponent
  ],
  imports: [
    CommonModule,
    InviteRoutingModule,
    ...TAIGA_MODULES
  ]
})
export class InviteModule { }
