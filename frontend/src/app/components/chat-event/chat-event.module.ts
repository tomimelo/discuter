import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule, TuiBadgeModule} from '@taiga-ui/kit';

import { ChatEventComponent } from './chat-event.component';
import { MessageModule } from '../message/message.module';
import { TuiHintModule } from '@taiga-ui/core';
import { JoinPipe } from 'src/app/pipes/join.pipe';

const TAIGA_MODULES = [
  TuiAvatarModule,
  TuiBadgeModule,
  TuiHintModule
]

@NgModule({
  declarations: [
    ChatEventComponent,
    JoinPipe
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
