import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessagerModule } from '../messager/messager.module';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MessagerModule
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
