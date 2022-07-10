import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import { NavbarModule } from 'src/app/shared/navbar/navbar.module';
import { TuiButtonModule, TuiHintModule} from '@taiga-ui/core';
import { ChatModule } from 'src/app/components/chat/chat.module';
import { ParticipantsListModule } from 'src/app/components/participants-list/participants-list.module';

const TAIGA_MODULES = [
  TuiButtonModule,
  TuiHintModule
]

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    NavbarModule,
    ChatModule,
    ParticipantsListModule,
    ...TAIGA_MODULES
  ]
})
export class RoomModule { }
