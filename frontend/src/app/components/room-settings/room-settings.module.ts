import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiToggleModule} from '@taiga-ui/kit';
import { RoomSettingsComponent } from './room-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiSvgModule } from '@taiga-ui/core';

const TAIGA_MODULES = [
  TuiToggleModule,
  TuiSvgModule
]

@NgModule({
  declarations: [RoomSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...TAIGA_MODULES
  ],
  exports: [
    RoomSettingsComponent
  ]
})
export class RoomSettingsModule { }
