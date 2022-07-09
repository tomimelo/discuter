import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessagerModule } from '../messager/messager.module';
import { MessageModule } from '../message/message.module';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MessagerModule,
    MessageModule
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
