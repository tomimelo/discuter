import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessagerModule } from '../messager/messager.module';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import {TuiBadgedContentModule, TuiBadgeModule} from '@taiga-ui/kit';
import { SkeletonMessageModule } from '../skeleton-message/skeleton-message.module';
import { ChatEventModule } from '../chat-event/chat-event.module';

const TAIGA_MODULES = [
  TuiScrollbarModule,
  TuiSvgModule,
  TuiBadgedContentModule,
  TuiBadgeModule
]
@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MessagerModule,
    ChatEventModule,
    SkeletonMessageModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
