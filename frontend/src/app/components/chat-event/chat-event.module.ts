import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule, TuiBadgeModule} from '@taiga-ui/kit';

import { ChatEventComponent } from './chat-event.component';
import { MessageModule } from '../message/message.module';

const TAIGA_MODULES = [
  TuiAvatarModule,
  TuiBadgeModule
]

@NgModule({
  declarations: [
    ChatEventComponent
  ],
  imports: [
    CommonModule,
    MessageModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ChatEventComponent
  ]
})
export class ChatEventModule { }
