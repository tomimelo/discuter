import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessagerModule } from '../messager/messager.module';
import { MessageModule } from '../message/message.module';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import {TuiBadgedContentModule, TuiBadgeModule} from '@taiga-ui/kit';

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
    ...TAIGA_MODULES
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
