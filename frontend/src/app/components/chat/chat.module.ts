import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessagerModule } from '../messager/messager.module';
import { MessageModule } from '../message/message.module';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import {TuiBadgedContentModule, TuiBadgeModule} from '@taiga-ui/kit';
import { SkeletonMessageModule } from '../skeleton-message/skeleton-message.module';

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
    MessageModule,
    SkeletonMessageModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
