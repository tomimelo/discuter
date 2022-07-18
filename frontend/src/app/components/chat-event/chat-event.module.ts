import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiAvatarModule} from '@taiga-ui/kit';

import { ChatEventComponent } from './chat-event.component';
import { TimePipe } from '../../pipes/time.pipe';

const TAIGA_MODULES = [
  TuiAvatarModule
]

@NgModule({
  declarations: [
    ChatEventComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    ...TAIGA_MODULES
  ],
  exports: [
    ChatEventComponent
  ]
})
export class ChatEventModule { }
