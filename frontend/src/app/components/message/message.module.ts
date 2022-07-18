import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule} from '@taiga-ui/kit';

import { MessageComponent } from './message.component';

const TAIGA_MODULES = [
  TuiAvatarModule
]

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule,
    ...TAIGA_MODULES
  ],
  exports: [
    MessageComponent
  ]
})
export class MessageModule { }
