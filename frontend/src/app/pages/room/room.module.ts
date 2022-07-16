import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import { NavbarModule } from 'src/app/components/navbar/navbar.module';
import { TuiButtonModule, TuiDataListModule, TuiHintModule, TuiHostedDropdownModule, TuiSvgModule} from '@taiga-ui/core';
import { ChatModule } from 'src/app/components/chat/chat.module';
import { ParticipantsListModule } from 'src/app/components/participants-list/participants-list.module';
import { ConfirmDialogModule } from 'src/app/components/confirm-dialog/confirm-dialog.module';
import { RoomSettingsModule } from 'src/app/components/room-settings/room-settings.module';

const TAIGA_MODULES = [
  TuiButtonModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiDataListModule,
  TuiSvgModule
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
    ConfirmDialogModule,
    RoomSettingsModule,
    ...TAIGA_MODULES
  ]
})
export class RoomModule { }
